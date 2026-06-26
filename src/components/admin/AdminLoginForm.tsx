"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAdmin } from "@/lib/api";
import { storeToken, useAdminSession } from "@/components/admin/auth";

const schema = z.object({
  email: z.string().email("Մուտքագրեք email-ը"),
  password: z.string().min(6, "Նվազագույնը 6 նիշ"),
});

type LoginValues = z.infer<typeof schema>;

export function AdminLoginForm() {
  const router = useRouter();
  const { hydrated, token } = useAdminSession();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@aroma.local",
      password: "admin12345",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError("");
    try {
      const response = await loginAdmin(values.email, values.password);
      storeToken(response.accessToken);
      router.replace("/admin/dashboard");
    } catch {
      setError("Չհաջողվեց մուտք գործել։ Ստուգեք backend-ը և ադմինի տվյալները։");
    }
  }

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/admin/dashboard");
    }
  }, [hydrated, router, token]);

  if (hydrated && token) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto my-16 max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Ադմինի մուտք</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Մուտք ադմին վահանակ</h1>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-zinc-700">Էլ. փոստ</span>
        <input
          {...register("email")}
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-[var(--accent)]"
        />
        {errors.email ? <span className="text-sm text-[var(--sale-strong)]">{errors.email.message}</span> : null}
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-zinc-700">Գաղտնաբառ</span>
        <input
          {...register("password")}
          type="password"
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-[var(--accent)]"
        />
        {errors.password ? (
          <span className="text-sm text-[var(--sale-strong)]">{errors.password.message}</span>
        ) : null}
      </label>
      {error ? <p className="mt-4 rounded-md bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent-strong)]">{error}</p> : null}
      <button
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:opacity-60"
      >
        {isSubmitting ? "Մուտք..." : "Մուտք գործել"}
      </button>
    </form>
  );
}
