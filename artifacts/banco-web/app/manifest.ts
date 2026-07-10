import type { MetadataRoute } from "next";

/** Neutral bilingual PWA manifest — install prompt uses English; AR UI unchanged. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BANCO — Cars, Real Estate & Industrial",
    short_name: "BANCO",
    description: "Browse cars, real estate, and industrial listings in Egypt",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#e11d48",
    lang: "en",
    dir: "ltr",
  };
}
