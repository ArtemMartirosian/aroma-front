"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAdmin } from "@/lib/api";
import { storeToken } from "@/components/admin/auth";

const schema = z.object({
  email: z.string().email("Введите email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type LoginValues = z.infer<typeof schema>;

export function AdminLoginForm() {
  const router = useRouter();
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
      setError("Не удалось войти. Проверьте backend и данные администратора.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto my-16 max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm uppercase tracking-[0.2em] text-rose-800">Admin login</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Вход в админку</h1>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-zinc-700">Email</span>
        <input
          {...register("email")}
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
        />
        {errors.email ? <span className="text-sm text-rose-700">{errors.email.message}</span> : null}
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-zinc-700">Пароль</span>
        <input
          {...register("password")}
          type="password"
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-rose-700"
        />
        {errors.password ? (
          <span className="text-sm text-rose-700">{errors.password.message}</span>
        ) : null}
      </label>
      {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
      <button
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:opacity-60"
      >
        {isSubmitting ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}
