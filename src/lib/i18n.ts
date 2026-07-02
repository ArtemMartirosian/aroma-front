import { cookies, headers } from "next/headers";
export {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  localeHtmlLang,
  localeIntl,
  localeLabels,
  localeOgLang,
  normalizeLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/locale-config";

import { LOCALE_COOKIE, normalizeLocale } from "@/lib/locale-config";

export async function getRequestLocale() {
  const headerStore = await headers();
  const headerLocale = normalizeLocale(headerStore.get("x-aroma-locale"));

  if (headerStore.get("x-aroma-locale")) {
    return headerLocale;
  }

  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
