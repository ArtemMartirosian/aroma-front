"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToken } from "@/components/admin/auth";
import { deleteProduct, getAdminProducts } from "@/lib/api";
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
        setMessage("Չհաջողվեց բեռնել ապրանքները backend-ից։");
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
      setMessage("Չհաջողվեց ջնջել ապրանքը backend-ում։");
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
            <p className="admin-kicker text-sm uppercase tracking-[0.2em]">Ապրանքներ</p>
            <h1 className="admin-title mt-2 text-3xl font-semibold">Ապրանքներ</h1>
          </div>
          <Link
            href="/admin/products/create"
            className="admin-button-primary rounded-full px-5 py-3 text-sm font-semibold transition"
          >
            Ստեղծել ապրանք
          </Link>
        </div>
        {message ? <p className="admin-notice mt-4 rounded-md p-3 text-sm">{message}</p> : null}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="admin-divider border-b admin-muted">
              <tr>
                <th className="py-3">Նկարներ</th>
                <th className="py-3">Անվանում</th>
                <th>Բրենդ</th>
                <th>Գին</th>
                <th className="text-right">Գործողություններ</th>
              </tr>
            </thead>
            <tbody className="admin-divider divide-y">
              {products.map((product) => {
                const previewImage = getProductPreviewImage(product);

                return (
                  <tr key={product.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {previewImage ? (
                          <img
                            src={imageUrl(previewImage)}
                            alt={product.name}
                            className="h-14 w-14 rounded-xl border border-black/10 object-cover"
                          />
                        ) : (
                          <div className="admin-muted flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-black/15 text-xs">
                            Նկար չկա
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="admin-title py-4 font-semibold">{product.name}</td>
                    <td className="admin-text">{product.brand?.name}</td>
                    <td className="admin-title">{formatPrice(product.price)}</td>
                    <td className="text-right">
                      <Link className="font-semibold text-blue-600 hover:text-blue-700" href={`/admin/products/edit/${product.id}`}>
                        Խմբագրել
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="ml-4 font-semibold text-zinc-500 transition hover:text-red-700"
                      >
                        Ջնջել
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!products.length ? (
            <div className="admin-muted py-8 text-center text-sm">Ապրանքները չեն բեռնվել backend-ից։</div>
          ) : null}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Ջնջե՞լ ապրանքը"
        description={
          productToDelete
            ? `Դուք պատրաստվում եք ջնջել «${productToDelete.name}» ապրանքը։ Այս գործողությունը շարունակե՞լ։`
            : ""
        }
        isSubmitting={isDeleting}
        confirmLabel="Այո, ջնջել"
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </AdminShell>
  );
}
