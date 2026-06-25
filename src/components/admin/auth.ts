"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/api";

const TOKEN_KEY = "aroma_admin_token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  setAuthToken(token);
  window.dispatchEvent(new Event("aroma-auth"));
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  setAuthToken(null);
  window.dispatchEvent(new Event("aroma-auth"));
}

export function useAdminToken() {
  const router = useRouter();
  const { hydrated, token } = useAdminSession();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      setAuthToken(null);
      router.replace("/admin/login");
      return;
    }
    setAuthToken(token);
  }, [hydrated, router, token]);

  return { token, ready: hydrated && Boolean(token) };
}

export function useAdminSession() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const token = useSyncExternalStore(subscribeToToken, getStoredToken, () => null);
  return { hydrated, token };
}

function subscribeToHydration() {
  return () => {};
}

function subscribeToToken(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("aroma-auth", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("aroma-auth", callback);
  };
}
