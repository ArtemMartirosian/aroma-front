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
      className="admin-panel mx-auto my-16 max-w-md rounded-[28px] p-6"
    >
      <p className="admin-kicker text-sm uppercase tracking-[0.2em]">Ադմինի մուտք</p>
      <h1 className="admin-title mt-2 text-3xl font-semibold">Մուտք ադմին վահանակ</h1>
      <label className="mt-6 block">
        <span className="admin-text text-sm font-medium">Էլ. փոստ</span>
        <input
          {...register("email")}
          className="admin-input mt-2 rounded-xl px-3 py-2.5 outline-none"
        />
        {errors.email ? <span className="text-sm text-[var(--sale-strong)]">{errors.email.message}</span> : null}
      </label>
      <label className="mt-4 block">
        <span className="admin-text text-sm font-medium">Գաղտնաբառ</span>
        <input
          {...register("password")}
          type="password"
          className="admin-input mt-2 rounded-xl px-3 py-2.5 outline-none"
        />
        {errors.password ? (
          <span className="text-sm text-[var(--sale-strong)]">{errors.password.message}</span>
        ) : null}
      </label>
      {error ? <p className="admin-notice mt-4 rounded-md p-3 text-sm">{error}</p> : null}
      <button
        disabled={isSubmitting}
        className="admin-button-primary mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-60"
      >
        {isSubmitting ? "Մուտք..." : "Մուտք գործել"}
      </button>
    </form>
  );
}
