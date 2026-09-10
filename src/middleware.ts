import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

import { type AppRole, isAppRole, resolveEffectiveRole } from "@/auth/roles";
import {
  GUILDROOM_COOKIE_NAME,
  GUILDROOM_COOKIE_VALUE,
  guildroomCookieOptions,
} from "@/common/guildroomDevice";
import { clientEnv } from "@/env/client.mjs";

const loginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login`;
const shopUrl = `${clientEnv.NEXT_PUBLIC_URL}/shop`;
const adminLandingUrl = `${clientEnv.NEXT_PUBLIC_URL}/admin/edit-products`;

const publicUrls = ["/login", "/newaccount"];
const protectedUrls = ["/shop", "/stats", "/account", "/wish"];
const adminUrls = [...protectedUrls, "/admin"];
const superadminUrls = ["/admin/superadmin", "/admin/announcements"];

const resolveRole = async (req: NextRequest): Promise<AppRole | undefined> => {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // A session is only authenticated once it is linked to a namu account.
  if (typeof token?.userId !== "number") {
    return undefined;
  }

  const dbRole = isAppRole(token.role) ? token.role : undefined;
  const keycloakRole = isAppRole(token.keycloakRole)
    ? token.keycloakRole
    : undefined;
  return resolveEffectiveRole(dbRole, keycloakRole);
};

export async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const queryParams = req.nextUrl.searchParams;

  // Allow /auth/callback page to render (Auth.js handles /api/auth/* separately via the route handler)
  if (pathName === "/auth/callback" || pathName.startsWith("/auth/callback/")) {
    return NextResponse.next();
  }

  const role = await resolveRole(req);
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
    // When navigating to ?guildroom=true (e.g. from the browser homescreen shortcut),
    // set a persistent cookie marking this as the guildroom tablet device and strip the param.
    if (queryParams.has("guildroom")) {
      const url = req.nextUrl.clone();
      url.searchParams.delete("guildroom");
      const response = NextResponse.redirect(url);
      response.cookies.set(
        GUILDROOM_COOKIE_NAME,
        GUILDROOM_COOKIE_VALUE,
        guildroomCookieOptions(),
      );
      return response;
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
      console.info(`Redirecting to login page from: ${pathName}`);
      return NextResponse.redirect(loginUrl);
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
