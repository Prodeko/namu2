import { type NextRequest, NextResponse } from "next/server";

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

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await getSessionFromRequest(req, res);
  const pathName = req.nextUrl.pathname;
  const queryParams = req.nextUrl.searchParams;

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

  // When navigating to ?guildroom=true (e.g. from the browser homescreen shortcut),
  // set a persistent cookie marking this as the guildroom tablet device and strip the param.
  if (queryParams.has("guildroom")) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("guildroom");
    const response = NextResponse.redirect(url);
    response.cookies.set("is_guildroom_device", "1", {
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Must be readable by client-side JS
    });
    return response;
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
