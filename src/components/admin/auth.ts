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
  const token = useSyncExternalStore(subscribeToToken, getStoredToken, () => null);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setAuthToken(token);
  }, [router, token]);

  return { token, ready: Boolean(token) };
}

function subscribeToToken(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("aroma-auth", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("aroma-auth", callback);
  };
}
