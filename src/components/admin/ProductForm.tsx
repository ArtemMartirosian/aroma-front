"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
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
type PendingDelete =
  | { type: "variant"; index: number; label: string }
  | { type: "image"; index: number; imageIndex: number; label: string };

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { ready, token } = useAdminToken();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(productId));
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
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
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variants",
  });
  const watchedVariants = useWatch({ control, name: "variants" });

  useEffect(() => {
    if (!ready || !token) return;

    let cancelled = false;

    async function bootstrapForm() {
      setMessage("");
      setIsBootstrapping(Boolean(productId));

      try {
        const [brandItems, categoryItems, product] = await Promise.all([
          getAdminBrands(),
          getAdminCategories(),
          productId ? getAdminProduct(productId) : Promise.resolve(null),
        ]);

        if (cancelled) {
          return;
        }

        setBrands(brandItems);
        setCategories(categoryItems);

        if (!product) {
          setValue("brandId", brandItems[0]?.id ?? "", { shouldDirty: false });
          setValue("categoryId", categoryItems[0]?.id ?? "", { shouldDirty: false });
          return;
        }

        const normalizedVariants = product.variants?.length
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
            ];

        reset({
          name: product.name ?? "",
          brandId: product.brandId ?? product.brand?.id ?? "",
          categoryId: product.categoryId ?? product.category?.id ?? "",
          gender: product.gender ?? "unisex",
          fragranceType: product.fragranceType ?? "floral",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          topNotes: product.topNotes ?? "",
          middleNotes: product.middleNotes ?? "",
          baseNotes: product.baseNotes ?? "",
          longevity: product.longevity ?? undefined,
          sillage: product.sillage ?? undefined,
          concentration: product.concentration ?? "",
          country: product.country ?? "",
          releaseYear: product.releaseYear ?? undefined,
          isFeatured: Boolean(product.isFeatured),
          isNew: Boolean(product.isNew),
          isActive: product.isActive ?? true,
          variants: normalizedVariants,
        });
        replace(normalizedVariants);
      } catch {
        if (cancelled) {
          return;
        }

        setBrands([]);
        setCategories([]);
        setMessage(
          productId
            ? "Չհաջողվեց բեռնել ապրանքի տվյալները backend-ից։"
            : "Չհաջողվեց բեռնել բրենդներն ու կատեգորիաները backend-ից։",
        );
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrapForm();

    return () => {
      cancelled = true;
    };
  }, [productId, ready, replace, reset, setValue, token]);

  async function onSubmit(values: ProductValues) {
    setMessage("");
    try {
      await saveProduct(values, productId);
      router.push("/admin/products");
    } catch {
      setMessage("Չհաջողվեց պահպանել։ Ստուգեք backend-ը, JWT-ն և պարտադիր դաշտերը։");
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

  function confirmDeleteAction() {
    if (!pendingDelete) {
      return;
    }

    if (pendingDelete.type === "variant") {
      remove(pendingDelete.index);
    } else {
      updateVariantImage(pendingDelete.index, pendingDelete.imageIndex, "");
    }

    setPendingDelete(null);
  }

  if (!ready) return null;

  if (productId && isBootstrapping) {
    return (
      <AdminShell>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Խմբագրել ապրանքը</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Բեռնվում են տվյալները...</h1>
          <p className="mt-4 text-sm text-zinc-500">
            Սպասեք մի պահ, բեռնում ենք ապրանքի ընթացիկ տվյալները։
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          {productId ? "Խմբագրել ապրանքը" : "Ստեղծել ապրանք"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          {productId ? "Խմբագրել ապրանքը" : "Ստեղծել ապրանք"}
        </h1>
        {message ? <p className="mt-4 rounded-md bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent-strong)]">{message}</p> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Անվանում" {...register("name")} />
          <Select label="Բրենդ" {...register("brandId")}>
            <option value="">Ընտրեք բրենդը</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Select label="Կատեգորիա" {...register("categoryId")}>
            <option value="">Ընտրեք կատեգորիան</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select label="Սեռ" {...register("gender")}>
            {genderOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select label="Բույրի տեսակ" {...register("fragranceType")}>
            {fragranceOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Input label="Կոնցենտրացիա" {...register("concentration")} />
          <Input label="Երկիր" {...register("country")} />
          <Input label="Թողարկման տարի" type="number" {...register("releaseYear")} />
          <Select label="Երկարակեցություն" {...register("longevity")}>
            <option value="">Նշված չէ</option>
            {longevityOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select label="Շլեյֆ" {...register("sillage")}>
            <option value="">Նշված չէ</option>
            {sillageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Textarea label="Կարճ նկարագրություն" {...register("shortDescription")} />
          <Textarea label="Նկարագրություն" {...register("description")} />
          <Input label="Վերին նոտաներ" {...register("topNotes")} />
          <Input label="Միջին նոտաներ" {...register("middleNotes")} />
          <Input label="Բազային նոտաներ" {...register("baseNotes")} />
        </div>
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Ծավալի տարբերակներ</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Մեկ ապրանքը կարող է ունենալ 20ml, 50ml, 100ml։ Յուրաքանչյուր տարբերակ ունի իր գինը և մի քանի նկար։
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
              Ավելացնել ծավալ
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
                  <Input label="Ծավալ" {...register(`variants.${index}.volume`)} />
                  <Input label="Գին" type="number" {...register(`variants.${index}.price`)} />
                  <Input label="Հին գին" type="number" {...register(`variants.${index}.oldPrice`)} />
                  <div className="flex items-end gap-3">
                    {fields.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setPendingDelete({
                            type: "variant",
                            index,
                            label: watchedVariants?.[index]?.volume || `#${index + 1}`,
                          })
                        }
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[var(--sale-strong)] hover:text-[var(--sale-strong)]"
                      >
                        Ջնջել ծավալը
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-zinc-950">Նկարներ այս ծավալի համար</h3>
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
                      Ավելացնել նկար
                    </button>
                  </div>
                  <div className="space-y-3">
                    {variantImages.map((image, imageIndex) => (
                      <div key={`${field.id}-${imageIndex}`} className="grid gap-3 lg:grid-cols-[1fr_auto]">
                        <ImageUploadField
                          label={`Նկար ${imageIndex + 1}`}
                          value={image}
                          onChange={(value) => updateVariantImage(index, imageIndex, value)}
                        />
                        {variantImages.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingDelete({
                                type: "image",
                                index,
                                imageIndex,
                                label: watchedVariants?.[index]?.volume || `#${index + 1}`,
                              })
                            }
                            className="h-fit rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[var(--sale-strong)] hover:text-[var(--sale-strong)] lg:self-center"
                          >
                            Ջնջել նկարը
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
          <Checkbox label="Հանրաճանաչ" {...register("isFeatured")} />
          <Checkbox label="Նորույթ" {...register("isNew")} />
          <Checkbox label="Ցուցադրել" {...register("isActive")} />
        </div>
        <button
          disabled={isSubmitting}
          className="mt-6 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:opacity-60"
        >
          {isSubmitting ? "Պահպանում..." : "Պահպանել"}
        </button>
      </form>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={
          pendingDelete?.type === "variant"
            ? "Ջնջե՞լ ծավալի տարբերակը"
            : "Ջնջե՞լ նկարը"
        }
        description={
          pendingDelete?.type === "variant"
            ? `Դուք պատրաստվում եք ջնջել «${pendingDelete.label}» ծավալի տարբերակը։ Շարունակե՞լ։`
            : pendingDelete
              ? `Դուք պատրաստվում եք ջնջել «${pendingDelete.label}» ծավալի նկարը։ Շարունակե՞լ։`
              : ""
        }
        confirmLabel="Այո, ջնջել"
        onConfirm={confirmDeleteAction}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminShell>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-[var(--accent)]"
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
        className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-[var(--accent)]"
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
        className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-[var(--accent)]"
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
