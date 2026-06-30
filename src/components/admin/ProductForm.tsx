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
  getApiErrorMessage,
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
import { isAccessoiresCategory } from "@/lib/category-groups";
import { Brand, Category } from "@/types/catalog";

const requiredNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
  z.number({ message: "Պարտադիր դաշտ է" }).min(0, "Չի կարող լինել բացասական"),
);

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
  z.number().min(0, "Չի կարող լինել բացասական").optional(),
);

const variantSchema = z.object({
  volume: z.string().optional().default(""),
  price: requiredNumber,
  oldPrice: optionalNumber,
  images: z.array(z.string().min(1)).min(1, "Ավելացրեք առնվազն մեկ նկար"),
});

const productSchema = z.object({
  name: z.string().trim().min(2, "Մուտքագրեք ապրանքի անվանումը"),
  slug: z.string().optional(),
  brandId: z.string().min(1, "Ընտրեք բրենդը"),
  categoryId: z.string().min(1, "Ընտրեք կատեգորիան"),
  gender: z.enum(["male", "female", "unisex"]).optional(),
  fragranceType: z.enum(["woody", "floral", "citrus", "oriental", "fresh", "sweet", "spicy"]).optional(),
  shortDescription: z.string().trim().min(5, "Գրեք կարճ նկարագրություն"),
  description: z.string().trim().min(10, "Գրեք ամբողջական նկարագրություն"),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  longevity: z.enum(["low", "medium", "high", "very_high"]).optional(),
  sillage: z.enum(["soft", "medium", "strong", "very_strong"]).optional(),
  concentration: z.string().optional(),
  country: z.string().optional(),
  releaseYear: optionalNumber,
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

function createEmptyVariant() {
  return {
    volume: "",
    price: undefined,
    oldPrice: undefined,
    images: [],
  };
}

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
    getValues,
    setValue,
    formState: { errors, isSubmitting },
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
      variants: [createEmptyVariant()],
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
  const categoryId = useWatch({ control, name: "categoryId" });
  const selectedCategory = categories.find((item) => item.id === categoryId);
  const isAccessoiresProduct = isAccessoiresCategory(selectedCategory?.slug);
  const isParfumeProduct =
    selectedCategory?.slug !== "cosmetics" && selectedCategory?.slug !== "accessoires";

  useEffect(() => {
    if (isParfumeProduct) {
      if (!getValues("fragranceType")) {
        setValue("fragranceType", "floral", { shouldDirty: true });
      }
      return;
    }

    setValue("fragranceType", undefined, { shouldDirty: true });
    setValue("topNotes", "", { shouldDirty: true });
    setValue("middleNotes", "", { shouldDirty: true });
    setValue("baseNotes", "", { shouldDirty: true });
    setValue("longevity", undefined, { shouldDirty: true });
    setValue("sillage", undefined, { shouldDirty: true });
    setValue("concentration", "", { shouldDirty: true });
  }, [getValues, isParfumeProduct, setValue]);

  useEffect(() => {
    if (!isAccessoiresProduct) {
      return;
    }

    const firstVariant = watchedVariants?.[0];

    if (!firstVariant) {
      replace([createEmptyVariant()]);
      return;
    }

    if ((watchedVariants?.length ?? 0) > 1) {
      replace([
        {
          volume: "",
          price: firstVariant.price,
          oldPrice: firstVariant.oldPrice,
          images: firstVariant.images ?? [],
        },
      ]);
      return;
    }

    if (firstVariant.volume) {
      setValue("variants.0.volume", "", {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [isAccessoiresProduct, replace, setValue, watchedVariants]);

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
              images: variant.images?.length ? variant.images : [],
            }))
          : [
              {
                volume: product.volume,
                price: Number(product.price),
                oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
                images: [],
              },
            ];

        reset({
          name: product.name ?? "",
          brandId: product.brandId ?? product.brand?.id ?? "",
          categoryId: product.categoryId ?? product.category?.id ?? "",
          gender: product.gender ?? "unisex",
          fragranceType: product.fragranceType ?? undefined,
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
    if (!isAccessoiresProduct) {
      const hasEmptyVolume = values.variants.some((variant) => !variant.volume?.trim());
      if (hasEmptyVolume) {
        setMessage("Տարբերակների համար նշեք ծավալը կամ չափը։");
        return;
      }
    }

    const normalizedValues = isAccessoiresProduct
      ? {
          ...values,
          price: values.variants[0]?.price,
          oldPrice: values.variants[0]?.oldPrice,
          volume: "",
          variants: [
            {
              ...values.variants[0],
              volume: "",
            },
          ],
        }
      : {
          ...values,
          variants: values.variants.map((variant) => ({
            ...variant,
            volume: variant.volume?.trim() ?? "",
          })),
        };

    try {
      await saveProduct(normalizedValues, productId);
      router.push("/admin/products");
    } catch (error) {
      setMessage(
        getApiErrorMessage(
          error,
          "Չհաջողվեց պահպանել։ Ստուգեք backend-ը, JWT-ն և պարտադիր դաշտերը։",
        ),
      );
    }
  }

  function onInvalidSubmit() {
    setMessage(
      isAccessoiresProduct
        ? "Լրացրեք պարտադիր դաշտերը։ Աքսեսուարի համար նշեք գինը և առնվազն մեկ նկար։"
        : "Լրացրեք պարտադիր դաշտերը։ Տարբերակի համար նշեք չափը, գինը և առնվազն մեկ նկար։",
    );
  }

  function setVariantImages(index: number, images: string[]) {
    setValue(`variants.${index}.images`, images, {
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
        <div className="admin-panel rounded-[24px] p-5">
          <p className="admin-kicker text-sm uppercase tracking-[0.2em]">Խմբագրել ապրանքը</p>
          <h1 className="admin-title mt-2 text-3xl font-semibold">Բեռնվում են տվյալները...</h1>
          <p className="admin-muted mt-4 text-sm">
            Սպասեք մի պահ, բեռնում ենք ապրանքի ընթացիկ տվյալները։
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        className="admin-panel rounded-[24px] p-5"
      >
        <p className="admin-kicker text-sm uppercase tracking-[0.2em]">
          {productId ? "Խմբագրել ապրանքը" : "Ստեղծել ապրանք"}
        </p>
        <h1 className="admin-title mt-2 text-3xl font-semibold">
          {productId ? "Խմբագրել ապրանքը" : "Ստեղծել ապրանք"}
        </h1>
        {message ? <p className="admin-notice mt-4 rounded-md p-3 text-sm">{message}</p> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Անվանում"
            placeholder="Օր.` Chanel Coco Mademoiselle"
            error={errors.name?.message}
            {...register("name")}
          />
          <Select label="Բրենդ" error={errors.brandId?.message} {...register("brandId")}>
            <option value="">Ընտրեք բրենդը</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Select label="Կատեգորիա" error={errors.categoryId?.message} {...register("categoryId")}>
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
          <Input label="Երկիր" placeholder="Օր.` France" {...register("country")} />
          <Input
            label="Թողարկման տարի"
            type="number"
            placeholder="Օր.` 2024"
            {...register("releaseYear", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          <Textarea
            label="Կարճ նկարագրություն"
            placeholder="Կարճ և հստակ ներկայացում քարտի համար"
            error={errors.shortDescription?.message}
            {...register("shortDescription")}
          />
          <Textarea
            label="Նկարագրություն"
            placeholder="Ամբողջական նկարագրություն ապրանքի էջի համար"
            error={errors.description?.message}
            {...register("description")}
          />
          {isParfumeProduct ? (
            <>
              <Select label="Բույրի տեսակ" {...register("fragranceType")}>
                {fragranceOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Input label="Կոնցենտրացիա" {...register("concentration")} />
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
              <Input label="Վերին նոտաներ" {...register("topNotes")} />
              <Input label="Միջին նոտաներ" {...register("middleNotes")} />
              <Input label="Բազային նոտաներ" {...register("baseNotes")} />
            </>
          ) : null}
        </div>
        <div className="admin-subpanel mt-6 rounded-[22px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="admin-title text-lg font-semibold">
                {isAccessoiresProduct ? "Ապրանքի տվյալներ" : "Ապրանքի տարբերակներ"}
              </h2>
              <p className="admin-muted mt-1 text-sm">
                {isAccessoiresProduct
                  ? "Աքսեսուարի համար պահվում է մեկ գին և մի քանի նկար։"
                  : "Սկզբում ավելացվում է մեկ դատարկ տարբերակ։ Եթե պետք լինի, հետո կարող եք ավելացնել ևս տարբերակներ։"}
              </p>
            </div>
            {!isAccessoiresProduct ? (
              <button
                type="button"
                onClick={() => append(createEmptyVariant())}
                className="admin-button-secondary rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                Ավելացնել տարբերակ
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {fields.map((field, index) => {
              const variantImages = watchedVariants?.[index]?.images?.length
                ? watchedVariants[index].images
                : [""];

              return (
              <div
                key={field.id}
                className="admin-panel rounded-[18px] p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="admin-title text-sm font-semibold">
                      {isAccessoiresProduct ? "Հիմնական տարբերակ" : `Տարբերակ ${index + 1}`}
                    </p>
                    <p className="admin-muted text-xs">
                      {isAccessoiresProduct ? "Նշեք գինը և ավելացրեք նկարներ" : "Օր.` 50ml, 100ml, set"}
                    </p>
                  </div>
                  {!isAccessoiresProduct && fields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingDelete({
                          type: "variant",
                          index,
                          label: watchedVariants?.[index]?.volume || `#${index + 1}`,
                        })
                      }
                      className="admin-button-secondary rounded-full px-4 py-2 text-sm font-semibold transition hover:text-red-700"
                    >
                      Ջնջել տարբերակը
                    </button>
                  ) : null}
                </div>
                <div className={`grid gap-3 ${isAccessoiresProduct ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                  {!isAccessoiresProduct ? (
                    <Input
                      label="Տարբերակ / չափ"
                      placeholder="Օր.` 50ml"
                      error={errors.variants?.[index]?.volume?.message}
                      {...register(`variants.${index}.volume`)}
                    />
                  ) : null}
                  <Input
                    label="Գին"
                    type="number"
                    placeholder="Օր.` 39000"
                    error={errors.variants?.[index]?.price?.message}
                    {...register(`variants.${index}.price`, {
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  />
                  <Input
                    label="Հին գին"
                    type="number"
                    placeholder="Ըստ ցանկության"
                    error={errors.variants?.[index]?.oldPrice?.message}
                    {...register(`variants.${index}.oldPrice`, {
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  />
                </div>

                <div className="admin-divider mt-4 border-t pt-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="admin-title text-sm font-semibold">Նկարներ այս տարբերակի համար</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setVariantImages(index, [
                          ...(watchedVariants?.[index]?.images ?? []),
                          "",
                        ])
                      }
                      className="admin-button-secondary rounded-full px-4 py-2 text-sm font-semibold transition"
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
                            className="admin-button-secondary h-fit rounded-full px-4 py-2 text-sm font-semibold transition hover:text-red-700 lg:self-center"
                          >
                            Ջնջել նկարը
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {errors.variants?.[index]?.images?.message ? (
                    <p className="mt-3 text-sm text-[var(--sale-strong)]">
                      {errors.variants[index]?.images?.message}
                    </p>
                  ) : null}
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
          className="admin-button-primary mt-6 rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-60"
        >
          {isSubmitting ? "Պահպանում..." : "Պահպանել"}
        </button>
      </form>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={
          pendingDelete?.type === "variant"
            ? "Ջնջե՞լ տարբերակը"
            : "Ջնջե՞լ նկարը"
        }
        description={
          pendingDelete?.type === "variant"
            ? `Դուք պատրաստվում եք ջնջել «${pendingDelete.label}» տարբերակը։ Շարունակե՞լ։`
            : pendingDelete
              ? `Դուք պատրաստվում եք ջնջել «${pendingDelete.label}» տարբերակի նկարը։ Շարունակե՞լ։`
              : ""
        }
        confirmLabel="Այո, ջնջել"
        onConfirm={confirmDeleteAction}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminShell>
  );
}

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="admin-text text-sm font-medium">{label}</span>
      <input
        {...props}
        className="admin-input mt-2 rounded-xl px-3 py-2.5 outline-none"
      />
      {error ? <span className="mt-1 block text-sm text-[var(--sale-strong)]">{error}</span> : null}
    </label>
  );
}

function Select({
  label,
  children,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="admin-text text-sm font-medium">{label}</span>
      <select
        {...props}
        className="admin-select mt-2 rounded-xl px-3 py-2.5 outline-none"
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-sm text-[var(--sale-strong)]">{error}</span> : null}
    </label>
  );
}

function Textarea({
  label,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="admin-text text-sm font-medium">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="admin-textarea mt-2 rounded-xl px-3 py-2.5 outline-none"
      />
      {error ? <span className="mt-1 block text-sm text-[var(--sale-strong)]">{error}</span> : null}
    </label>
  );
}

function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="admin-subpanel admin-text flex items-center gap-2 rounded-xl p-3 text-sm font-medium">
      <input {...props} type="checkbox" className="h-4 w-4" />
      {label}
    </label>
  );
}
