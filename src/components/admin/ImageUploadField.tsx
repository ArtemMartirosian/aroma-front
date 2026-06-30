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
      setError("Չհաջողվեց բեռնել նկարը։");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-subpanel rounded-[20px] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-28 w-36 overflow-hidden rounded-xl border border-black bg-white">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="admin-muted flex h-full w-full items-center justify-center text-xs">
              Նկար չկա
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="admin-text text-sm font-medium">{label}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="admin-button-primary inline-flex cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition">
              {uploading ? "Բեռնում..." : "Բեռնել նկարը"}
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
                className="admin-button-secondary rounded-full px-4 py-2 text-sm font-semibold transition hover:text-red-700"
              >
                Հեռացնել
              </button>
            ) : null}
          </div>
          {error ? <p className="mt-2 text-sm text-[var(--sale-strong)]">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
