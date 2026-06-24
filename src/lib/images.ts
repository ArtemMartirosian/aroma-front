const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function imageUrl(src?: string | null, fallback = "/images/perfume-hero.png") {
  if (!src) return fallback;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }
  if (src.startsWith("/uploads/")) {
    return `${API_ORIGIN}${src}`;
  }
  return src;
}
