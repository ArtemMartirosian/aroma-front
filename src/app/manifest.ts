import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Aroma",
    description: "Aroma Parfume, cosmetics & accessoires online catalog",
    start_url: "/am",
    scope: "/",
    display: "standalone",
    background_color: "#0e1011",
    theme_color: "#0e1011",
    icons: [
      {
        src: `${SITE_URL}/favicon.ico`,
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: `${SITE_URL}/images/aroma-logo.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
