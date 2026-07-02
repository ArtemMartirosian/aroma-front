"use client";

import { createContext, useContext, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE, Locale } from "@/lib/locale-config";
import { getTranslations } from "@/lib/translations";

type LocaleContextValue = {
  locale: Locale;
  messages: ReturnType<typeof getTranslations>;
  isPending: boolean;
  setLocale: (locale: Locale, nextPath?: string) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function setLocale(nextLocale: Locale, nextPath?: string) {
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setLocaleState(nextLocale);
    startTransition(() => {
      if (nextPath) {
        router.replace(nextPath);
        return;
      }

      router.refresh();
    });
  }

  const value = useMemo(
    () => ({
      locale,
      messages: getTranslations(locale),
      isPending,
      setLocale,
    }),
    [isPending, locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}
