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
  getAdminBrands,
  getAdminCategories,
  saveBrand,
  saveCategory,
} from "@/lib/api";
import { imageUrl } from "@/lib/images";
import { Brand, Category } from "@/types/catalog";

type Mode = "brands" | "categories";

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
            setImage(currentItem.image ?? "");
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

  async function createItem() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage("Մուտքագրեք անվանումը։");
      return;
    }
    const payload = {
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
      setImage("");
      setDescription("");
    } catch (error) {
      const fallbackMessage =
        typeof error === "object" &&
        error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response &&
        "data" in error.response
          ? JSON.stringify(error.response.data)
          : "Ստուգեք backend-ը և JWT-ն։";
      setMessage(`Չհաջողվեց պահպանել։ ${fallbackMessage}`);
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
    } catch {
      setMessage("Չհաջողվեց ջնջել գրառումը backend-ում։");
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
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-800">
              {isBrands ? "Բրենդներ" : "Կատեգորիաներ"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">{pageTitle}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-950"
              >
                {backLabel ?? "Վերադառնալ"}
              </Link>
            ) : null}
            {createHref ? (
              <Link
                href={createHref}
                className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                {primaryActionLabel}
              </Link>
            ) : null}
          </div>
        </div>
        {message ? <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-600">{message}</p> : null}
        {showCreateForm ? (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-[240px_1fr_auto]">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Անվանում"
                className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
              />
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Նկարագրություն"
                className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
              />
              <button
                type="button"
                onClick={createItem}
                disabled={isSaving}
                className="rounded-md bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:opacity-60"
              >
                {isSaving ? "Պահպանում..." : submitButtonLabel}
              </button>
            </div>
            <div className="mt-3">
              <ImageUploadField
                label={isBrands ? "Բրենդի նկար" : "Կատեգորիայի նկար"}
                value={image}
                onChange={setImage}
              />
            </div>
          </>
        ) : null}
        {showItems ? (
          <div className="mt-6 divide-y divide-zinc-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(item.image)}
                      alt={item.name}
                      className="h-16 w-24 rounded-md border border-zinc-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-md border border-dashed border-zinc-300 text-xs text-zinc-400">
                      Նկար չկա
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-zinc-950">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 sm:gap-5">
                  <Link
                    href={isBrands ? `/admin/brands/edit/${item.id}` : `/admin/categories/edit/${item.id}`}
                    className="font-semibold text-zinc-500 transition hover:text-zinc-950"
                  >
                    Խմբագրել
                  </Link>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="font-semibold text-rose-800 transition hover:text-rose-900"
                  >
                    Ջնջել
                  </button>
                </div>
              </div>
            ))}
            {!items.length ? (
              <div className="py-8 text-center text-sm text-zinc-500">
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
