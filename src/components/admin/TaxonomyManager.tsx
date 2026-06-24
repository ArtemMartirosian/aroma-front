"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminToken } from "@/components/admin/auth";
import {
  deleteBrand,
  deleteCategory,
  getAdminBrands,
  getAdminCategories,
  saveBrand,
  saveCategory,
} from "@/lib/api";
import { mockBrands, mockCategories } from "@/lib/mock-data";
import { Brand, Category } from "@/types/catalog";

type Mode = "brands" | "categories";

export function TaxonomyManager({ mode }: { mode: Mode }) {
  const { ready } = useAdminToken();
  const isBrands = mode === "brands";
  const [items, setItems] = useState<Array<Brand | Category>>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const loadItems = useCallback(() => {
    const loader = isBrands ? getAdminBrands : getAdminCategories;
    loader()
      .then(setItems)
      .catch(() => {
        setItems(isBrands ? mockBrands : mockCategories);
        setMessage("Backend недоступен, показаны демо-данные.");
      });
  }, [isBrands]);

  useEffect(() => {
    if (ready) loadItems();
  }, [loadItems, ready]);

  async function createItem() {
    if (!name.trim()) return;
    const payload = { name, description, isActive: true };
    try {
      const created = isBrands ? await saveBrand(payload) : await saveCategory(payload);
      setItems((current) => [...current, created]);
      setName("");
      setDescription("");
    } catch {
      setMessage("Не удалось сохранить. Проверьте backend и JWT.");
    }
  }

  async function removeItem(id: string) {
    try {
      if (isBrands) await deleteBrand(id);
      else await deleteCategory(id);
    } catch {
      setMessage("Удаление в demo mode выполнено только на экране.");
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  if (!ready) return null;

  return (
    <AdminShell>
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-800">
          {isBrands ? "Brands" : "Categories"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          {isBrands ? "Бренды" : "Категории"}
        </h1>
        {message ? <p className="mt-4 rounded-md bg-zinc-50 p-3 text-sm text-zinc-600">{message}</p> : null}
        <div className="mt-6 grid gap-3 md:grid-cols-[240px_1fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Название"
            className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Описание"
            className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
          />
          <button
            type="button"
            onClick={createItem}
            className="rounded-md bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Добавить
          </button>
        </div>
        <div className="mt-6 divide-y divide-zinc-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-zinc-950">{item.name}</p>
                <p className="text-sm text-zinc-500">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="font-semibold text-zinc-500 hover:text-rose-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
