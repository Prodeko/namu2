import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/auth/ironsession";
import { clientEnv } from "@/env/client.mjs";

const loginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login`;
const adminLoginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login/admin`;
const shopUrl = `${clientEnv.NEXT_PUBLIC_URL}/shop`;
const adminLandingUrl = `${clientEnv.NEXT_PUBLIC_URL}/admin/edit-products`;

const publicUrls = ["/login", "/newaccount"];
const protectedUrls = ["/shop", "/stats", "/account", "/wish"];
const adminUrls = [...protectedUrls, "/admin"];
const superadminUrls = ["/admin/superadmin"];

type AppRole = "USER" | "ADMIN" | "SUPERADMIN";

const isAppRole = (value: unknown): value is AppRole =>
  value === "USER" || value === "ADMIN" || value === "SUPERADMIN";

const resolveRole = async (
  req: NextRequest,
  res: NextResponse,
): Promise<AppRole | undefined> => {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const tokenRole = token?.role;

  if (isAppRole(tokenRole)) {
    return tokenRole;
  }

  const legacySession = await getSessionFromRequest(req, res);
  return legacySession?.user?.role;
};

export async function middleware(req: NextRequest, res: NextResponse) {
  const pathName = req.nextUrl.pathname;
  const queryParams = req.nextUrl.searchParams;

  // Allow /auth/callback page to render (Auth.js handles /api/auth/* separately via the route handler)
  if (pathName.includes("auth")) {
    return NextResponse.next();
  }

  const role = await resolveRole(req, res);
  const authenticated = Boolean(role);
  const adminAccount = role === "ADMIN" || role === "SUPERADMIN";
  const superadminAccount = role === "SUPERADMIN";
  const userAccount = role === "USER";

  const isPublicPage = publicUrls.some((url) => pathName.startsWith(url));
  const isUserProtectedPage = protectedUrls.some((url) =>
    pathName.startsWith(url),
  );
  const isAdminPage = adminUrls.some((url) => pathName.startsWith(url));
  const isSuperadminPage = superadminUrls.some((url) =>
    pathName.startsWith(url),
  );

  // This prevents redirect back to shop / admin landing page after logout
  const isLoggingOut = queryParams.has("loggedOut");
  if (isLoggingOut) {
    return NextResponse.next();
  }

  if (!authenticated) {
    if (!isPublicPage) {
      console.info(`Redirecting to login page from: ${pathName}`);
      return NextResponse.redirect(loginUrl);
    }
  } else if (adminAccount && !superadminAccount) {
    if (isPublicPage || isSuperadminPage) {
      console.info(`Redirecting to admin restock page from: ${pathName}`);
      return NextResponse.redirect(adminLandingUrl);
    }
  } else if (userAccount) {
    if (!isUserProtectedPage) {
      console.info(`Redirecting to shop page from: ${pathName}`);
      return NextResponse.redirect(shopUrl);
    }
  } else if (!adminAccount) {
    if (isAdminPage || isSuperadminPage) {
      console.info(`Redirecting to admin login page from: ${pathName}`);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|.well-known|favicon.ico|public|manifest.webmanifest|web-app-manifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
