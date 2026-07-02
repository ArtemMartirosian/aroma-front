export const LOCALE_COOKIE = "aroma-locale";
export const SUPPORTED_LOCALES = ["am", "ru", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "am";

export const localeLabels: Record<Locale, string> = {
  am: "AM",
  ru: "RU",
  en: "EN",
};

export const localeHtmlLang: Record<Locale, string> = {
  am: "hy",
  ru: "ru",
  en: "en",
};

export const localeOgLang: Record<Locale, string> = {
  am: "hy_AM",
  ru: "ru_RU",
  en: "en_US",
};

export const localeIntl: Record<Locale, string> = {
  am: "hy-AM",
  ru: "ru-RU",
  en: "en-US",
};

export function normalizeLocale(value?: string | null): Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
    ? (value as Locale)
    : DEFAULT_LOCALE;
}
