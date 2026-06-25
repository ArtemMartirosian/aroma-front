"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToken } from "@/components/admin/auth";
import { deleteProduct, getAdminProducts } from "@/lib/api";
import { formatPrice } from "@/lib/dictionaries";
import { Product } from "@/types/catalog";

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
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Ապրանքներ</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Ապրանքներ</h1>
          </div>
          <Link
            href="/admin/products/create"
            className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Ստեղծել ապրանք
          </Link>
        </div>
        {message ? <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-600">{message}</p> : null}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="py-3">Անվանում</th>
                <th>Բրենդ</th>
                <th>Գին</th>
                <th className="text-right">Գործողություններ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-4 font-semibold text-zinc-950">{product.name}</td>
                  <td>{product.brand?.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td className="text-right">
                    <Link className="font-semibold text-rose-800" href={`/admin/products/edit/${product.id}`}>
                      Խմբագրել
                    </Link>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(product)}
                      className="ml-4 font-semibold text-zinc-500 hover:text-rose-800"
                    >
                      Ջնջել
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length ? (
            <div className="py-8 text-center text-sm text-zinc-500">Ապրանքները չեն բեռնվել backend-ից։</div>
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
