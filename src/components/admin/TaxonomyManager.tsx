"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToken } from "@/components/admin/auth";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  deleteBrand,
  deleteCategory,
  getApiErrorMessage,
  getAdminBrands,
  getAdminCategories,
  saveBrand,
  saveCategory,
} from "@/lib/api";
import { imageUrl } from "@/lib/images";
import { Brand, Category } from "@/types/catalog";

type Mode = "brands" | "categories";
const protectedCategorySlugs = new Set(["cosmetics", "accessoires"]);

type TaxonomyManagerProps = {
  mode: Mode;
  showCreateForm?: boolean;
  showItems?: boolean;
  createHref?: string;
  redirectAfterCreate?: string;
  entityId?: string;
  title?: string;
  actionLabel?: string;
  submitLabel?: string;
  backHref?: string;
  backLabel?: string;
};

export function TaxonomyManager({
  mode,
  showCreateForm = true,
  showItems = true,
  createHref,
  redirectAfterCreate,
  entityId,
  title,
  actionLabel,
  submitLabel,
  backHref,
  backLabel,
}: TaxonomyManagerProps) {
  const router = useRouter();
  const { ready } = useAdminToken();
  const isBrands = mode === "brands";
  const [items, setItems] = useState<Array<Brand | Category>>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Brand | Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formInitialized, setFormInitialized] = useState(!entityId);

  const loadItems = useCallback(() => {
    const loader = isBrands ? getAdminBrands : getAdminCategories;
    loader()
      .then((loadedItems) => {
        setItems(loadedItems);
        if (entityId && !formInitialized) {
          const currentItem = loadedItems.find((item) => item.id === entityId);
          if (currentItem) {
            setName(currentItem.name ?? "");
            setDescription(currentItem.description ?? "");
            setImage("image" in currentItem ? currentItem.image ?? "" : "");
            setFormInitialized(true);
          }
        }
        setMessage("");
      })
      .catch(() => {
        setItems([]);
        setMessage(`Չհաջողվեց բեռնել ${isBrands ? "բրենդները" : "կատեգորիաները"} backend-ից։`);
      });
  }, [entityId, formInitialized, isBrands]);

  useEffect(() => {
    if (ready) loadItems();
  }, [loadItems, ready]);

  function isProtectedCategory(item: Brand | Category) {
    return !isBrands && "slug" in item && protectedCategorySlugs.has(item.slug);
  }

  async function createItem() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage("Մուտքագրեք անվանումը։");
      return;
    }
    const payload = isBrands
      ? {
          name: trimmedName,
          description,
          image,
          logo: trimmedName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 3)
            .toUpperCase(),
          isActive: true,
        }
      : {
          name: trimmedName,
          description,
          isActive: true,
        };
    setIsSaving(true);
    setMessage("");
    try {
      const created =
        isBrands
          ? await saveBrand(payload, entityId)
          : await saveCategory(payload, entityId);
      if (redirectAfterCreate) {
        router.push(redirectAfterCreate);
        return;
      }
      if (entityId) {
        setItems((current) => current.map((item) => (item.id === entityId ? created : item)));
      } else {
        setItems((current) => [...current, created]);
      }
      setName("");
      if (isBrands) {
        setImage("");
      }
      setDescription("");
    } catch (error) {
      setMessage(
        getApiErrorMessage(error, "Չհաջողվեց պահպանել։ Ստուգեք backend-ը և JWT-ն։"),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function removeItem(id: string) {
    setIsDeleting(true);
    try {
      if (isBrands) await deleteBrand(id);
      else await deleteCategory(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setItemToDelete(null);
    } catch (error) {
      setMessage(
        getApiErrorMessage(error, "Չհաջողվեց ջնջել գրառումը backend-ում։"),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (!ready) return null;

  const pageTitle = title ?? (isBrands ? "Բրենդներ" : "Կատեգորիաներ");
  const primaryActionLabel = actionLabel ?? (isBrands ? "Ստեղծել բրենդ" : "Ստեղծել կատեգորիա");
  const submitButtonLabel =
    submitLabel ?? (entityId ? "Պահպանել փոփոխությունները" : "Ավելացնել");

  return (
    <AdminShell>
      <div className="admin-panel rounded-[24px] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="admin-kicker text-sm uppercase tracking-[0.2em]">
              {isBrands ? "Բրենդներ" : "Կատեգորիաներ"}
            </p>
            <h1 className="admin-title mt-2 text-3xl font-semibold">{pageTitle}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className="admin-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold transition"
              >
                {backLabel ?? "Վերադառնալ"}
              </Link>
            ) : null}
            {createHref ? (
              <Link
                href={createHref}
                className="admin-button-primary rounded-full px-5 py-2.5 text-sm font-semibold transition"
              >
                {primaryActionLabel}
              </Link>
            ) : null}
          </div>
        </div>
        {message ? <p className="admin-notice mt-4 rounded-md p-3 text-sm">{message}</p> : null}
        {showCreateForm ? (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-[240px_1fr_auto]">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Անվանում"
                className="admin-input rounded-xl px-3 py-2.5 outline-none"
              />
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Նկարագրություն"
                className="admin-input rounded-xl px-3 py-2.5 outline-none"
              />
              <button
                type="button"
                onClick={createItem}
                disabled={isSaving}
                className="admin-button-primary rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60"
              >
                {isSaving ? "Պահպանում..." : submitButtonLabel}
              </button>
            </div>
            {isBrands ? (
              <div className="mt-3">
                <ImageUploadField
                  label="Բրենդի նկար"
                  value={image}
                  onChange={setImage}
                />
              </div>
            ) : null}
          </>
        ) : null}
        {showItems ? (
          <div className="admin-divider mt-6 divide-y">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {isBrands && "image" in item && item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(item.image)}
                      alt={item.name}
                      className="h-16 w-24 rounded-xl border border-black object-cover"
                    />
                  ) : isBrands ? (
                    <div className="admin-muted flex h-16 w-24 items-center justify-center rounded-xl border border-dashed border-black text-xs">
                      Նկար չկա
                    </div>
                  ) : null}
                  <div>
                    <p className="admin-title font-semibold">{item.name}</p>
                    <p className="admin-muted text-sm">{item.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 sm:gap-5">
                  <Link
                    href={isBrands ? `/admin/brands/edit/${item.id}` : `/admin/categories/edit/${item.id}`}
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Խմբագրել
                  </Link>
                  {isProtectedCategory(item) ? (
                    <span className="admin-muted text-sm font-semibold">Պաշտպանված</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="font-semibold text-red-700 transition hover:text-black"
                    >
                      Ջնջել
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!items.length ? (
              <div className="admin-muted py-8 text-center text-sm">
                {isBrands ? "Բրենդները" : "Կատեգորիաները"} չեն բեռնվել backend-ից։
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title={isBrands ? "Ջնջե՞լ բրենդը" : "Ջնջե՞լ կատեգորիան"}
        description={
          itemToDelete
            ? `Դուք պատրաստվում եք ջնջել «${itemToDelete.name}»-ը։ Այս գործողությունը շարունակե՞լ։`
            : ""
        }
        isSubmitting={isDeleting}
        confirmLabel="Այո, ջնջել"
        onConfirm={() => itemToDelete && removeItem(itemToDelete.id)}
        onCancel={() => setItemToDelete(null)}
      />
    </AdminShell>
  );
}
