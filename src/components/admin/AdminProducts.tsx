"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToken } from "@/components/admin/auth";
import { deleteProduct, getAdminProducts } from "@/lib/api";
import { adminMessages } from "@/lib/admin-copy";
import { formatPrice } from "@/lib/dictionaries";
import { imageUrl } from "@/lib/images";
import { normalizeProductVariants } from "@/lib/product-variants";
import { Product } from "@/types/catalog";

function getProductPreviewImage(product: Product) {
  return Array.from(
    new Set(
      normalizeProductVariants(product)
        .flatMap((variant) => variant.images ?? [])
        .filter(Boolean),
    ),
  )[0];
}

export function AdminProducts() {
  const { ready } = useAdminToken();
  const messages = adminMessages;
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function loadProducts() {
    getAdminProducts()
      .then((response) => {
        setProducts(response.items);
        setMessage("");
      })
      .catch(() => {
        setProducts([]);
        setMessage(messages.products.loadError);
      });
  }

  useEffect(() => {
    if (ready) loadProducts();
  }, [ready]);

  async function confirmDelete() {
    if (!productToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProducts((current) => current.filter((item) => item.id !== productToDelete.id));
      setProductToDelete(null);
      setMessage("");
    } catch {
      setMessage(messages.products.deleteError);
    } finally {
      setIsDeleting(false);
    }
  }

  if (!ready) return null;

  return (
    <AdminShell>
      <div className="admin-panel rounded-[24px] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="admin-kicker text-sm uppercase tracking-[0.2em]">{messages.products.title}</p>
            <h1 className="admin-title mt-2 text-3xl font-semibold">{messages.products.title}</h1>
          </div>
          <Link
            href="/admin/products/create"
            className="admin-button-primary rounded-full px-5 py-3 text-sm font-semibold transition"
          >
            {messages.products.create}
          </Link>
        </div>
        {message ? <p className="admin-notice mt-4 rounded-md p-3 text-sm">{message}</p> : null}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="admin-divider border-b admin-muted">
              <tr>
                <th className="py-3">{messages.products.tableImage}</th>
                <th className="py-3">{messages.products.tableName}</th>
                <th>{messages.products.tableBrand}</th>
                <th>{messages.products.tablePrice}</th>
                <th className="text-right">{messages.products.tableActions}</th>
              </tr>
            </thead>
            <tbody className="admin-divider divide-y">
              {products.map((product) => {
                const previewImage = getProductPreviewImage(product);
                const productName = product.name;
                const brandName = product.brand?.name ?? "";

                return (
                  <tr key={product.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {previewImage ? (
                          <img
                            src={imageUrl(previewImage)}
                            alt={productName}
                            className="h-14 w-14 rounded-xl border border-black/10 object-cover"
                          />
                        ) : (
                          <div className="admin-muted flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-black/15 text-xs">
                            {messages.common.imageMissing}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="admin-title py-4 font-semibold">{productName}</td>
                    <td className="admin-text">{brandName}</td>
                    <td className="admin-title">{formatPrice(product.price, "am")}</td>
                    <td className="text-right">
                      <Link className="font-semibold text-blue-600 hover:text-blue-700" href={`/admin/products/edit/${product.id}`}>
                        {messages.common.edit}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="ml-4 font-semibold text-zinc-500 transition hover:text-red-700"
                      >
                        {messages.common.delete}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!products.length ? (
            <div className="admin-muted py-8 text-center text-sm">{messages.products.loadError}</div>
          ) : null}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(productToDelete)}
        title={messages.products.deleteTitle}
        description={
          productToDelete
            ? messages.products.deleteDescription(productToDelete.name)
            : ""
        }
        isSubmitting={isDeleting}
        confirmLabel={messages.common.yesDelete}
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </AdminShell>
  );
}
