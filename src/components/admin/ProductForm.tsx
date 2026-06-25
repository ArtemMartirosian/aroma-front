"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminToken } from "@/components/admin/auth";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  getAdminBrands,
  getAdminCategories,
  getAdminProduct,
  saveProduct,
} from "@/lib/api";
import {
  fragranceOptions,
  genderOptions,
  longevityOptions,
  sillageOptions,
} from "@/lib/dictionaries";
import { Brand, Category } from "@/types/catalog";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().min(0).optional(),
);

const variantSchema = z.object({
  volume: z.string().min(1),
  price: z.coerce.number().min(0),
  oldPrice: optionalNumber,
  images: z.array(z.string().min(1)).min(1),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  gender: z.enum(["male", "female", "unisex"]),
  fragranceType: z.enum(["woody", "floral", "citrus", "oriental", "fresh", "sweet", "spicy"]),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  longevity: z.enum(["low", "medium", "high", "very_high"]).optional(),
  sillage: z.enum(["soft", "medium", "strong", "very_strong"]).optional(),
  concentration: z.string().optional(),
  country: z.string().optional(),
  releaseYear: z.coerce.number().optional(),
  variants: z.array(variantSchema).min(1),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
});

type ProductInput = z.input<typeof productSchema>;
type ProductValues = z.output<typeof productSchema>;

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { ready } = useAdminToken();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<ProductInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brandId: "",
      categoryId: "",
      gender: "unisex",
      fragranceType: "floral",
      shortDescription: "",
      description: "",
      variants: [
        { volume: "20ml", price: 18000, images: ["/images/products/perfume-card-1.png"] },
        { volume: "50ml", price: 39000, images: ["/images/products/perfume-card-2.png"] },
        { volume: "100ml", price: 59000, images: ["/images/products/perfume-card-3.png"] },
      ],
      isFeatured: false,
      isNew: false,
      isActive: true,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const watchedVariants = useWatch({ control, name: "variants" });

  useEffect(() => {
    if (!ready) return;
    Promise.all([getAdminBrands(), getAdminCategories()])
      .then(([brandItems, categoryItems]) => {
        setBrands(brandItems);
        setCategories(categoryItems);
        if (!productId) {
          setValue("brandId", brandItems[0]?.id ?? "", { shouldDirty: false });
          setValue("categoryId", categoryItems[0]?.id ?? "", { shouldDirty: false });
        }
      })
      .catch(() => {
        setBrands([]);
        setCategories([]);
        setMessage("Не удалось загрузить бренды и категории из backend.");
      });

    if (productId) {
      getAdminProduct(productId)
        .then((product) => {
          reset({
            ...product,
            variants: product.variants?.length
              ? product.variants.map((variant) => ({
                  volume: variant.volume,
                  price: Number(variant.price),
                  oldPrice: variant.oldPrice ? Number(variant.oldPrice) : undefined,
                  images: variant.images?.length ? variant.images : ["/images/products/perfume-card-1.png"],
                }))
              : [
                  {
                    volume: product.volume,
                    price: Number(product.price),
                    oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
                    images: ["/images/products/perfume-card-1.png"],
                  },
                ],
          });
        })
        .catch(() => setMessage("Не удалось загрузить товар из API."));
    }
  }, [productId, ready, reset, setValue]);

  async function onSubmit(values: ProductValues) {
    setMessage("");
    try {
      await saveProduct(values, productId);
      router.push("/admin/products");
    } catch {
      setMessage("Не удалось сохранить. Проверьте backend, JWT и обязательные поля.");
    }
  }

  function setVariantImages(index: number, images: string[]) {
    setValue(`variants.${index}.images`, images.filter(Boolean), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function updateVariantImage(index: number, imageIndex: number, value: string) {
    const images = [...(watchedVariants?.[index]?.images ?? [])];
    if (value) {
      images[imageIndex] = value;
      setVariantImages(index, images);
    } else {
      setVariantImages(
        index,
        images.filter((_, currentIndex) => currentIndex !== imageIndex),
      );
    }
  }

  if (!ready) return null;

  return (
    <AdminShell>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-rose-800">
          {productId ? "Edit product" : "Create product"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          {productId ? "Редактировать товар" : "Создать товар"}
        </h1>
        {message ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{message}</p> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Название" {...register("name")} />
          <Input label="Slug" {...register("slug")} />
          <Select label="Бренд" {...register("brandId")}>
            <option value="">Выберите бренд</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Select label="Категория" {...register("categoryId")}>
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select label="Пол" {...register("gender")}>
            {genderOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select label="Тип аромата" {...register("fragranceType")}>
            {fragranceOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Input label="Концентрация" {...register("concentration")} />
          <Input label="Страна" {...register("country")} />
          <Input label="Год выпуска" type="number" {...register("releaseYear")} />
          <Select label="Стойкость" {...register("longevity")}>
            <option value="">Не указано</option>
            {longevityOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select label="Шлейф" {...register("sillage")}>
            <option value="">Не указано</option>
            {sillageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Textarea label="Краткое описание" {...register("shortDescription")} />
          <Textarea label="Описание" {...register("description")} />
          <Input label="Верхние ноты" {...register("topNotes")} />
          <Input label="Средние ноты" {...register("middleNotes")} />
          <Input label="Базовые ноты" {...register("baseNotes")} />
        </div>
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Варианты объема</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Один товар может иметь 20ml, 50ml, 100ml. У каждого варианта своя цена и несколько картинок.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                append({
                  volume: "100ml",
                  price: 0,
                  images: ["/images/products/perfume-card-1.png"],
                })
              }
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Добавить объем
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {fields.map((field, index) => {
              const variantImages = watchedVariants?.[index]?.images?.length
                ? watchedVariants[index].images
                : [""];

              return (
              <div
                key={field.id}
                className="rounded-md border border-zinc-200 bg-white p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <Input label="Объем" {...register(`variants.${index}.volume`)} />
                  <Input label="Цена" type="number" {...register(`variants.${index}.price`)} />
                  <Input label="Старая цена" type="number" {...register(`variants.${index}.oldPrice`)} />
                  <div className="flex items-end gap-3">
                    {fields.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-rose-800 hover:text-rose-800"
                      >
                        Удалить объем
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-zinc-950">Картинки для этого объема</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setVariantImages(index, [
                          ...(watchedVariants?.[index]?.images ?? []),
                          "/images/products/perfume-card-1.png",
                        ])
                      }
                      className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
                    >
                      Добавить картинку
                    </button>
                  </div>
                  <div className="space-y-3">
                    {variantImages.map((image, imageIndex) => (
                      <div key={`${field.id}-${imageIndex}`} className="grid gap-3 lg:grid-cols-[1fr_auto]">
                        <ImageUploadField
                          label={`Картинка ${imageIndex + 1}`}
                          value={image}
                          onChange={(value) => updateVariantImage(index, imageIndex, value)}
                        />
                        {variantImages.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => updateVariantImage(index, imageIndex, "")}
                            className="h-fit rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-rose-800 hover:text-rose-800 lg:self-center"
                          >
                            Удалить картинку
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Checkbox label="Популярный" {...register("isFeatured")} />
          <Checkbox label="Новинка" {...register("isNew")} />
          <Checkbox label="Показывать" {...register("isActive")} />
        </div>
        <button
          disabled={isSubmitting}
          className="mt-6 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:opacity-60"
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </AdminShell>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
      />
    </label>
  );
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <select
        {...props}
        className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-rose-700"
      >
        {children}
      </select>
    </label>
  );
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
      />
    </label>
  );
}

function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-zinc-200 p-3 text-sm font-medium text-zinc-700">
      <input {...props} type="checkbox" className="h-4 w-4" />
      {label}
    </label>
  );
}
