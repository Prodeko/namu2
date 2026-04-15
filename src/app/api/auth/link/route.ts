import { type NextRequest, NextResponse } from "next/server";

import {
  KEYCLOAK_PENDING_LINK_SESSION_COOKIE,
  LINK_COOKIE_MAX_AGE_SECONDS,
  encodeAuthCookie,
} from "@/server/auth/cookies";
import { db } from "@/server/db/prisma";

/**
 * Entry point scanned from the tablet QR code on the user's phone.
 * Validates the link session token, stores it in a signed cookie, then
 * redirects to a tiny client page that calls `signIn("keycloak")` — which
 * bypasses NextAuth's intermediate sign-in UI and goes straight to Keycloak.
 *
 * This route is intentionally unauthenticated — the session id in the URL
 * is the capability token.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing session id", { status: 400 });
  }

  const row = await db.keycloakLinkSession.findUnique({ where: { id } });

  if (!row) {
    return new NextResponse("Link session not found", { status: 404 });
  }

  if (row.status !== "ACTIVE" || row.expiresAt < new Date()) {
    return new NextResponse("Link session expired or already used", {
      status: 410,
    });
  }

  const token = await encodeAuthCookie({ pendingLinkSessionId: id });

  const response = NextResponse.redirect(
    new URL("/auth/link-redirect", req.nextUrl.origin),
  );

  response.cookies.set(KEYCLOAK_PENDING_LINK_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: LINK_COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}
