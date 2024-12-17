import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Namukilke",
    short_name: "Namu",
    description: "Namukilke Snack Store",
    start_url: "/",
    display: "standalone",
    theme_color: "#f3d2e7",
    background_color: "#f3d2e7",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
