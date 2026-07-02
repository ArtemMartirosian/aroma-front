"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminToken } from "@/components/admin/auth";
import { getAdminBrands, getAdminCategories, getAdminDashboard } from "@/lib/api";
import { adminMessages } from "@/lib/admin-copy";
import { formatPrice } from "@/lib/dictionaries";
import { DashboardStats } from "@/types/catalog";

export function AdminDashboard() {
  const { ready } = useAdminToken();
  const messages = adminMessages;
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
        setMessage(messages.dashboard.loadError);
      });
  }, [messages.dashboard.loadError, ready]);

  if (!ready) return null;

  const cards = [
    [messages.dashboard.totalProducts, stats?.totalProducts ?? 0],
    [messages.dashboard.brands, brandCount],
    [messages.dashboard.categories, categoryCount],
    [messages.dashboard.newest, stats?.newProducts ?? 0],
    [messages.dashboard.featured, stats?.featuredProducts ?? 0],
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <p className="admin-kicker text-sm uppercase tracking-[0.2em]">{messages.dashboard.eyebrow}</p>
          <h1 className="admin-title mt-2 text-3xl font-semibold">{messages.dashboard.title}</h1>
        </div>
        {message ? <p className="admin-notice rounded-md p-3 text-sm">{message}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="admin-panel rounded-[22px] p-5">
              <p className="admin-muted text-sm">{label}</p>
              <p className="admin-title mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="admin-panel rounded-[24px] p-5">
          <h2 className="admin-title text-xl font-semibold">{messages.dashboard.latestProducts}</h2>
          <div className="admin-divider mt-4 divide-y">
            {(stats?.latestProducts ?? []).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="admin-title font-semibold">{product.name}</p>
                  <p className="admin-muted text-sm">{product.brand?.name}</p>
                </div>
                <p className="admin-title font-semibold">{formatPrice(product.price, "am")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
