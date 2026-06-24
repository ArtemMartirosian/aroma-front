"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/api";
import { imageUrl } from "@/lib/images";

type ImageUploadFieldProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
};

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadImage(file);
      onChange(uploaded.url);
    } catch {
      setError("Не удалось загрузить картинку.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-28 w-36 overflow-hidden rounded-md border border-zinc-200 bg-white">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
              No image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">{label}</span>
            <input
              value={value ?? ""}
              onChange={(event) => onChange(event.target.value)}
              placeholder="/uploads/image.jpg или URL"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-rose-700"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">
              {uploading ? "Загрузка..." : "Загрузить картинку"}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(event) => void handleFile(event.target.files?.[0])}
                className="sr-only"
              />
            </label>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-rose-800 hover:text-rose-800"
              >
                Убрать
              </button>
            ) : null}
          </div>
          {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
