import { type NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/auth/ironsession";
import { clientEnv } from "@/env/client.mjs";
import { Role } from "@prisma/client";

const loginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login`;
const adminLoginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login/admin`;
const shopUrl = `${clientEnv.NEXT_PUBLIC_URL}/shop`;
const adminLandingUrl = `${clientEnv.NEXT_PUBLIC_URL}/admin/restock`;
const publicUrls = ["/login", "/login/admin", "/newaccount"];
const protectedUrls = ["/shop", "/stats", "/account", "/wish"];

const isLoggedOut = (role: Role | undefined): boolean => {
  return !role;
};

const isAdminAccount = (role: Role | undefined): boolean => {
  return role === "ADMIN" || role === "SUPERADMIN";
};

const isUserAccount = (role: Role | undefined): boolean => {
  return role === "USER";
};

const rerouteFromProtectedPage = (
  role: Role | undefined,
  pathName: string,
): boolean => {
  if (!role && !publicUrls.includes(pathName)) {
    return true;
  }
  return false;
};

const rerouteFromAdminPage = (
  role: Role | undefined,
  pathName: string,
): boolean => {
  if (!isAdminAccount(role) && pathName.startsWith("/admin")) {
    return true;
  }
  return false;
};

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await getSessionFromRequest(req, res);
  const role = session?.user?.role;
  const pathName = req.nextUrl.pathname;

  // This prevents redirect back to shop / admin landing page after logout
  const queryParams = req.nextUrl.searchParams;
  const isLoggingOut = queryParams.has("loggedOut");
  if (isLoggingOut) {
    return NextResponse.next();
  }

  // Skip middleware for logged out users accessing public pages
  if (isLoggedOut(role) && publicUrls.includes(pathName)) {
    return NextResponse.next();
  }

  // Skip middleware for logged in users accessing protected pages
  if (isUserAccount(role) && protectedUrls.includes(pathName)) {
    return NextResponse.next();
  }

  // Skip middleware for admin users accessing admin pages
  if (isAdminAccount(role) && pathName.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Redirect to login page if user is not logged in
  if (rerouteFromProtectedPage(role, pathName)) {
    console.info(`Redirecting to login page from: ${pathName}`);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin login page if user is not an admin
  if (rerouteFromAdminPage(role, pathName)) {
    console.info(`Redirecting to admin login page from: ${pathName}`);
    return NextResponse.redirect(adminLoginUrl);
  }

  // Redirect to shop page if user is logged in and tries to access public pages
  if (isUserAccount(role) && !protectedUrls.includes(pathName)) {
    console.info(`Redirecting to shop page from: ${pathName}`);
    return NextResponse.redirect(shopUrl);
  }

  // Redirect to restock page if admin is logged in and tries to access non-admin pages
  if (isAdminAccount(role) && !pathName.startsWith("/admin")) {
    console.info(`Redirecting to admin restock page from: ${pathName}`);
    return NextResponse.redirect(adminLandingUrl);
  }
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
