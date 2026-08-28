import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Namukilke",
    short_name: "Namu",
    description: "Namukilke Snack Store",
    // Points at a real page rather than "/", which only redirects: a
    // redirect-only route has no document of its own, so launching the
    // installed app there can surface the 404 page instead of the login
    // screen. Signed-in users are forwarded on from /login by middleware.
    start_url: "/login",
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
