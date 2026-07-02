import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LOCALE_COOKIE } from "@/lib/locale-config";
import { getDefaultLocalizedPath, getPathLocale, shouldBypassLocale } from "@/lib/routing";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (shouldBypassLocale(pathname)) {
    return NextResponse.next();
  }

  const pathLocale = getPathLocale(pathname);

  if (!pathLocale) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getDefaultLocalizedPath(pathname).split("?")[0];
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-aroma-locale", pathLocale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(LOCALE_COOKIE, pathLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
