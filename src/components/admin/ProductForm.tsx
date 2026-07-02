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
import { adminMessages, type AdminMessages } from "@/lib/admin-copy";
import {
  getFragranceOptions,
  getGenderOptions,
  getLongevityOptions,
  getSillageOptions,
} from "@/lib/dictionaries";
import { isAccessoiresCategory } from "@/lib/category-groups";
import { Brand, Category } from "@/types/catalog";

function createRequiredNumber(messages: AdminMessages) {
  return z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
    z.number({ message: messages.products.requiredField }).min(0, messages.products.nonNegative),
  );
}

function createOptionalNumber(messages: AdminMessages) {
  return z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
    z.number().min(0, messages.products.nonNegative).optional(),
  );
}

function createProductSchema(messages: AdminMessages) {
  const requiredNumber = createRequiredNumber(messages);
  const optionalNumber = createOptionalNumber(messages);

  const variantSchema = z.object({
    volume: z.string().optional().default(""),
    price: requiredNumber,
    oldPrice: optionalNumber,
    images: z.array(z.string().min(1)).min(1, messages.products.variantImagesError),
  });

  return z.object({
    name: z.string().trim().min(2, messages.products.nameRequired),
    nameRu: z.string().optional(),
    nameEn: z.string().optional(),
    slug: z.string().optional(),
    brandId: z.string().min(1, messages.products.chooseBrand),
    categoryId: z.string().min(1, messages.products.chooseCategory),
    gender: z.enum(["male", "female", "unisex"]).optional(),
    fragranceType: z.enum(["woody", "floral", "citrus", "oriental", "fresh", "sweet", "spicy"]).optional(),
    description: z.string().trim().min(10, messages.products.descriptionRequired),
    descriptionRu: z.string().optional(),
    descriptionEn: z.string().optional(),
    topNotes: z.string().optional(),
    topNotesRu: z.string().optional(),
    topNotesEn: z.string().optional(),
    middleNotes: z.string().optional(),
    middleNotesRu: z.string().optional(),
    middleNotesEn: z.string().optional(),
    baseNotes: z.string().optional(),
    baseNotesRu: z.string().optional(),
    baseNotesEn: z.string().optional(),
    longevity: z.enum(["low", "medium", "high", "very_high"]).optional(),
    sillage: z.enum(["soft", "medium", "strong", "very_strong"]).optional(),
    concentration: z.string().optional(),
    concentrationRu: z.string().optional(),
    concentrationEn: z.string().optional(),
    country: z.string().optional(),
    releaseYear: optionalNumber,
    variants: z.array(variantSchema).min(1),
    isFeatured: z.boolean(),
    isNew: z.boolean(),
    isActive: z.boolean(),
  });
}

type ProductSchema = ReturnType<typeof createProductSchema>;
type ProductInput = z.input<ProductSchema>;
type ProductValues = z.output<ProductSchema>;
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
  const messages = adminMessages;
  const productSchema = createProductSchema(messages);
  const genderOptions = getGenderOptions("am");
  const fragranceOptions = getFragranceOptions("am");
  const longevityOptions = getLongevityOptions("am");
  const sillageOptions = getSillageOptions("am");
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
      nameRu: "",
      nameEn: "",
      brandId: "",
      categoryId: "",
      gender: "unisex",
      fragranceType: "floral",
      description: "",
      descriptionRu: "",
      descriptionEn: "",
      topNotes: "",
      topNotesRu: "",
      topNotesEn: "",
      middleNotes: "",
      middleNotesRu: "",
      middleNotesEn: "",
      baseNotes: "",
      baseNotesRu: "",
      baseNotesEn: "",
      concentration: "",
      concentrationRu: "",
      concentrationEn: "",
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
          nameRu: product.nameRu ?? "",
          nameEn: product.nameEn ?? "",
          brandId: product.brandId ?? product.brand?.id ?? "",
          categoryId: product.categoryId ?? product.category?.id ?? "",
          gender: product.gender ?? "unisex",
          fragranceType: product.fragranceType ?? undefined,
          description: product.description ?? "",
          descriptionRu: product.descriptionRu ?? "",
          descriptionEn: product.descriptionEn ?? "",
          topNotes: product.topNotes ?? "",
          topNotesRu: product.topNotesRu ?? "",
          topNotesEn: product.topNotesEn ?? "",
          middleNotes: product.middleNotes ?? "",
          middleNotesRu: product.middleNotesRu ?? "",
          middleNotesEn: product.middleNotesEn ?? "",
          baseNotes: product.baseNotes ?? "",
          baseNotesRu: product.baseNotesRu ?? "",
          baseNotesEn: product.baseNotesEn ?? "",
          longevity: product.longevity ?? undefined,
          sillage: product.sillage ?? undefined,
          concentration: product.concentration ?? "",
          concentrationRu: product.concentrationRu ?? "",
          concentrationEn: product.concentrationEn ?? "",
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
            ? messages.products.loadFormError
            : messages.products.loadMetaError,
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
  }, [messages.products.loadFormError, messages.products.loadMetaError, productId, ready, replace, reset, setValue, token]);

  async function onSubmit(values: ProductValues) {
    setMessage("");
    if (!isAccessoiresProduct) {
      const hasEmptyVolume = values.variants.some((variant) => !variant.volume?.trim());
      if (hasEmptyVolume) {
        setMessage(messages.products.invalidVariantVolume);
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
          messages.products.saveError,
        ),
      );
    }
  }

  function onInvalidSubmit() {
    setMessage(
      isAccessoiresProduct
        ? messages.products.invalidAccessory
        : messages.products.invalidProduct,
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
          <p className="admin-kicker text-sm uppercase tracking-[0.2em]">{messages.products.editTitle}</p>
          <h1 className="admin-title mt-2 text-3xl font-semibold">{messages.common.loading}</h1>
          <p className="admin-muted mt-4 text-sm">
            {messages.products.loadingCurrent}
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
          {productId ? messages.products.editTitle : messages.products.createTitle}
        </p>
        <h1 className="admin-title mt-2 text-3xl font-semibold">
          {productId ? messages.products.editTitle : messages.products.createTitle}
        </h1>
        {message ? <p className="admin-notice mt-4 rounded-md p-3 text-sm">{message}</p> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label={messages.products.nameAm}
            placeholder="Օր.` Chanel Coco Mademoiselle"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input label={messages.products.nameRu} {...register("nameRu")} />
          <Input label={messages.products.nameEn} {...register("nameEn")} />
          <Select label={messages.products.brand} error={errors.brandId?.message} {...register("brandId")}>
            <option value="">{messages.products.chooseBrand}</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Select label={messages.products.category} error={errors.categoryId?.message} {...register("categoryId")}>
            <option value="">{messages.products.chooseCategory}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select label={messages.products.gender} {...register("gender")}>
            {genderOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Input label={messages.products.country} placeholder="Օր.` France" {...register("country")} />
          <Input
            label={messages.products.releaseYear}
            type="number"
            placeholder="Օր.` 2024"
            {...register("releaseYear", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          <Textarea
            label={messages.products.descriptionAm}
            placeholder="Ամբողջական նկարագրություն ապրանքի էջի համար"
            error={errors.description?.message}
            {...register("description")}
          />
          <Textarea label={messages.products.descriptionRu} {...register("descriptionRu")} />
          <Textarea label={messages.products.descriptionEn} {...register("descriptionEn")} />
          {isParfumeProduct ? (
            <>
              <Select label={messages.products.fragranceType} {...register("fragranceType")}>
                {fragranceOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Input label={messages.products.concentrationAm} {...register("concentration")} />
              <Input label={messages.products.concentrationRu} {...register("concentrationRu")} />
              <Input label={messages.products.concentrationEn} {...register("concentrationEn")} />
              <Select label={messages.products.longevity} {...register("longevity")}>
                <option value="">Նշված չէ</option>
                {longevityOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select label={messages.products.sillage} {...register("sillage")}>
                <option value="">Նշված չէ</option>
                {sillageOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Input label={messages.products.topNotesAm} {...register("topNotes")} />
              <Input label={messages.products.topNotesRu} {...register("topNotesRu")} />
              <Input label={messages.products.topNotesEn} {...register("topNotesEn")} />
              <Input label={messages.products.middleNotesAm} {...register("middleNotes")} />
              <Input label={messages.products.middleNotesRu} {...register("middleNotesRu")} />
              <Input label={messages.products.middleNotesEn} {...register("middleNotesEn")} />
              <Input label={messages.products.baseNotesAm} {...register("baseNotes")} />
              <Input label={messages.products.baseNotesRu} {...register("baseNotesRu")} />
              <Input label={messages.products.baseNotesEn} {...register("baseNotesEn")} />
            </>
          ) : null}
        </div>
        <div className="admin-subpanel mt-6 rounded-[22px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="admin-title text-lg font-semibold">
                {isAccessoiresProduct ? messages.products.variantSectionAccessory : messages.products.variantSectionProduct}
              </h2>
              <p className="admin-muted mt-1 text-sm">
                {isAccessoiresProduct
                  ? messages.products.variantSectionAccessoryHint
                  : messages.products.variantSectionProductHint}
              </p>
            </div>
            {!isAccessoiresProduct ? (
              <button
                type="button"
                onClick={() => append(createEmptyVariant())}
                className="admin-button-secondary rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                {messages.products.addVariant}
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
                      {isAccessoiresProduct ? messages.products.variantPrimary : messages.products.variantNumber(index)}
                    </p>
                    <p className="admin-muted text-xs">
                      {isAccessoiresProduct ? messages.products.variantHintAccessory : messages.products.variantHintProduct}
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
                      {messages.products.deleteVariant}
                    </button>
                  ) : null}
                </div>
                <div className={`grid gap-3 ${isAccessoiresProduct ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                  {!isAccessoiresProduct ? (
                    <Input
                      label={messages.products.variantVolume}
                      placeholder="Օր.` 50ml"
                      error={errors.variants?.[index]?.volume?.message}
                      {...register(`variants.${index}.volume`)}
                    />
                  ) : null}
                  <Input
                    label={messages.products.price}
                    type="number"
                    placeholder="Օր.` 39000"
                    error={errors.variants?.[index]?.price?.message}
                    {...register(`variants.${index}.price`, {
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  />
                  <Input
                    label={messages.products.oldPrice}
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
                    <h3 className="admin-title text-sm font-semibold">{messages.products.imagesForVariant}</h3>
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
                      {messages.products.addImage}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {variantImages.map((image, imageIndex) => (
                      <div key={`${field.id}-${imageIndex}`} className="grid gap-3 lg:grid-cols-[1fr_auto]">
                        <ImageUploadField
                          label={messages.products.imageLabel(imageIndex)}
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
                            {messages.products.deleteImage}
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
          <Checkbox label={messages.products.featured} {...register("isFeatured")} />
          <Checkbox label={messages.products.isNew} {...register("isNew")} />
          <Checkbox label={messages.products.active} {...register("isActive")} />
        </div>
        <button
          disabled={isSubmitting}
          className="admin-button-primary mt-6 rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-60"
        >
          {isSubmitting ? messages.common.saving : messages.common.save}
        </button>
      </form>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={
          pendingDelete?.type === "variant"
            ? messages.products.deleteVariantTitle
            : messages.products.deleteImageTitle
        }
        description={
          pendingDelete?.type === "variant"
            ? messages.products.deleteVariantDescription(pendingDelete.label)
            : pendingDelete
              ? messages.products.deleteImageDescription
              : ""
        }
        confirmLabel={messages.common.yesDelete}
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
