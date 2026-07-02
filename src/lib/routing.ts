import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "@/lib/locale-config";

export function isLocale(value?: string | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getPathLocale(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getPathLocale(pathname);

  if (!locale) {
    return pathname || "/";
  }

  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function localizePath(locale: Locale, href: string) {
  if (!href.startsWith("/")) {
    return href;
  }

  const [pathname, search = ""] = href.split("?");
  const basePath = stripLocaleFromPathname(pathname);
  const localizedPath = basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;

  return search ? `${localizedPath}?${search}` : localizedPath;
}

export function replaceLocaleInPathname(pathname: string, locale: Locale) {
  const basePath = stripLocaleFromPathname(pathname);
  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}

export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function shouldBypassLocale(pathname: string) {
  return (
    isAdminPath(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export function getDefaultLocalizedPath(pathname: string, search = "") {
  const basePath = stripLocaleFromPathname(pathname);
  const localized = basePath === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${basePath}`;
  return search ? `${localized}${search}` : localized;
}
