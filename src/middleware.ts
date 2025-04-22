import { type NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { getSessionFromRequest } from "@/auth/ironsession";
import {
  isAdminAccount,
  isAuthenticated,
  isSuperadminAccount,
  isUserAccount,
} from "@/auth/utils";
import { clientEnv } from "@/env/client.mjs";

const loginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login`;
const adminLoginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login/admin`;
const shopUrl = `${clientEnv.NEXT_PUBLIC_URL}/shop`;
const adminLandingUrl = `${clientEnv.NEXT_PUBLIC_URL}/admin/edit-products`;

const publicUrls = ["/login", "/newaccount"];
const protectedUrls = ["/shop", "/stats", "/account", "/wish"];
const adminUrls = [...protectedUrls, "/admin"];
const superadminUrls = ["/admin/superadmin"];

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0] || "";
    return ip.trim();
  }
  return "anonymous";
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await getSessionFromRequest(req, res);
  const pathName = req.nextUrl.pathname;
  const queryParams = req.nextUrl.searchParams;

  console.log("pathname", pathName);
  const rateLimitedPaths = ["login", "newaccount"];

  if (rateLimitedPaths.some((path) => pathName.includes(path))) {
    const ip = getClientIp(req);
    if (ip == "anonymous")
      console.log("couldn't figure out ip for rate limiting");
    await rateLimiter.consume(ip);
  }

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

  if (!isAuthenticated(session)) {
    if (!isPublicPage) {
      console.info(`Redirecting to login page from: ${pathName}`);
      return NextResponse.redirect(loginUrl);
    }
  } else if (isAdminAccount(session) && !isSuperadminAccount(session)) {
    if (isPublicPage || isSuperadminPage) {
      console.info(`Redirecting to admin restock page from: ${pathName}`);
      return NextResponse.redirect(adminLandingUrl);
    }
  } else if (isUserAccount(session)) {
    if (!isUserProtectedPage) {
      console.info(`Redirecting to shop page from: ${pathName}`);
      return NextResponse.redirect(shopUrl);
    }
  } else if (!isAdminAccount(session)) {
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
