"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminToken } from "@/components/admin/auth";
import { deleteProduct, getAdminProducts } from "@/lib/api";
import { formatPrice } from "@/lib/dictionaries";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types/catalog";

export function AdminProducts() {
  const { ready } = useAdminToken();
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  function loadProducts() {
    getAdminProducts()
      .then((response) => setProducts(response.items))
      .catch(() => {
        setProducts(mockProducts);
        setMessage("Backend недоступен, показаны демо-товары.");
      });
  }

  useEffect(() => {
    if (ready) loadProducts();
  }, [ready]);

  if (!ready) return null;

  return (
    <AdminShell>
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Products</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Товары</h1>
          </div>
          <Link
            href="/admin/products/create"
            className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Создать товар
          </Link>
        </div>
        {message ? <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-600">{message}</p> : null}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="py-3">Название</th>
                <th>Бренд</th>
                <th>Цена</th>
                <th>Объемы</th>
                <th>Статусы</th>
                <th className="text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-4 font-semibold text-zinc-950">{product.name}</td>
                  <td>{product.brand?.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    {product.variants?.length
                      ? product.variants.map((variant) => variant.volume).join(", ")
                      : product.volume}
                  </td>
                  <td>
                    {product.isFeatured ? "Popular " : ""}
                    {product.isNew ? "New " : ""}
                    {!product.isActive ? "Hidden" : ""}
                  </td>
                  <td className="text-right">
                    <Link className="font-semibold text-rose-800" href={`/admin/products/edit/${product.id}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteProduct(product.id).catch(() => null);
                        setProducts((current) => current.filter((item) => item.id !== product.id));
                      }}
                      className="ml-4 font-semibold text-zinc-500 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
