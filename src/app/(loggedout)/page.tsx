import { redirect } from "next/navigation";

/**
 * `/` exists only to forward to the login page. It must not be statically
 * prerendered: a redirect-only route has no renderable output, so Next.js
 * bakes the root `not-found.tsx` document into `.next/server/app/index.html`
 * and into the route's RSC payload, and only carries the redirect in the
 * response status. Anything that reads the body instead of acting on the 307
 * — a client-side prefetch (which bypasses middleware, see `matcher.missing`),
 * or a cache holding the prefetch variant — then renders the 404 page.
 * Rendering on demand keeps `/` a real redirect in every representation.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  redirect("/login");
}
