"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminToken } from "@/components/admin/auth";
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
import { mockBrands, mockCategories } from "@/lib/mock-data";
import { Brand, Category } from "@/types/catalog";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.coerce.number().min(0),
  oldPrice: z.coerce.number().optional(),
  volume: z.string().min(1),
  gender: z.enum(["male", "female", "unisex"]),
  fragranceType: z.enum(["woody", "floral", "citrus", "oriental", "fresh", "sweet", "spicy"]),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  mainImage: z.string().optional(),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  longevity: z.enum(["low", "medium", "high", "very_high"]).optional(),
  sillage: z.enum(["soft", "medium", "strong", "very_strong"]).optional(),
  concentration: z.string().optional(),
  country: z.string().optional(),
  releaseYear: z.coerce.number().optional(),
  stockStatus: z.string().min(1),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
});

type ProductInput = z.input<typeof productSchema>;
type ProductValues = z.output<typeof productSchema>;

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { ready } = useAdminToken();
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brandId: mockBrands[0]?.id ?? "",
      categoryId: mockCategories[0]?.id ?? "",
      price: 0,
      volume: "100ml",
      gender: "unisex",
      fragranceType: "floral",
      shortDescription: "",
      description: "",
      mainImage: "/images/perfume-hero.png",
      stockStatus: "В наличии",
      isAvailable: true,
      isFeatured: false,
      isNew: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!ready) return;
    Promise.all([getAdminBrands(), getAdminCategories()])
      .then(([brandItems, categoryItems]) => {
        setBrands(brandItems);
        setCategories(categoryItems);
      })
      .catch(() => null);

    if (productId) {
      getAdminProduct(productId)
        .then((product) => {
          reset({
            ...product,
            price: Number(product.price),
            oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
          });
        })
        .catch(() => setMessage("Не удалось загрузить товар из API."));
    }
  }, [productId, ready, reset]);

  async function onSubmit(values: ProductValues) {
    setMessage("");
    try {
      await saveProduct(
        {
          ...values,
          galleryImages: values.mainImage ? [values.mainImage] : [],
        },
        productId,
      );
      router.push("/admin/products");
    } catch {
      setMessage("Не удалось сохранить. Проверьте backend, JWT и обязательные поля.");
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
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Select label="Категория" {...register("categoryId")}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input label="Цена" type="number" {...register("price")} />
          <Input label="Старая цена" type="number" {...register("oldPrice")} />
          <Input label="Объем" {...register("volume")} />
          <Input label="Главное изображение URL" {...register("mainImage")} />
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
          <Input label="Статус наличия" {...register("stockStatus")} />
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
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Checkbox label="В наличии" {...register("isAvailable")} />
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
