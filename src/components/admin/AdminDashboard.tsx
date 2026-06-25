"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminToken } from "@/components/admin/auth";
import { getAdminBrands, getAdminCategories, getAdminDashboard } from "@/lib/api";
import { formatPrice } from "@/lib/dictionaries";
import { DashboardStats } from "@/types/catalog";

export function AdminDashboard() {
  const { ready } = useAdminToken();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [brandCount, setBrandCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ready) return;
    Promise.all([getAdminDashboard(), getAdminBrands(), getAdminCategories()])
      .then(([dashboard, brands, categories]) => {
        setStats(dashboard);
        setBrandCount(brands.length);
        setCategoryCount(categories.length);
        setMessage("");
      })
      .catch(() => {
        setStats({
          totalProducts: 0,
          featuredProducts: 0,
          newProducts: 0,
          latestProducts: [],
        });
        setBrandCount(0);
        setCategoryCount(0);
        setMessage("Չհաջողվեց բեռնել վահանակը backend-ից։");
      });
  }, [ready]);

  if (!ready) return null;

  const cards = [
    ["Ապրանքներ", stats?.totalProducts ?? 0],
    ["Բրենդներ", brandCount],
    ["Կատեգորիաներ", categoryCount],
    ["Նորույթներ", stats?.newProducts ?? 0],
    ["Հանրաճանաչ", stats?.featuredProducts ?? 0],
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Ընդհանուր տեսք</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Վահանակ</h1>
        </div>
        {message ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-800">{message}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">Վերջին ապրանքները</h2>
          <div className="mt-4 divide-y divide-zinc-100">
            {(stats?.latestProducts ?? []).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-zinc-950">{product.name}</p>
                  <p className="text-sm text-zinc-500">{product.brand?.name}</p>
                </div>
                <p className="font-semibold text-zinc-950">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
