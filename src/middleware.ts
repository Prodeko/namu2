import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Role } from "@prisma/client";

import { getSessionFromRequest } from "./auth/ironsession";
import { clientEnv } from "./env/client.mjs";

const loginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login`;
const adminLoginUrl = `${clientEnv.NEXT_PUBLIC_URL}/login/admin`;
const publicUrls = ["/login", "/admin/login", "/newaccount"];

const validateProtectedPageAccess = (
  role: Role | undefined,
  pathName: string,
): boolean => {
  if (!role && !publicUrls.includes(pathName)) {
    return false;
  }
  return true;
};

const validateAdminPageAccess = (role: Role | undefined): boolean => {
  if (role === "ADMIN" || role === "SUPERADMIN") {
    return true;
  }
  return false;
};

export async function middleware(req: NextRequest, res: NextResponse) {
  const session = await getSessionFromRequest(req, res);
  const role = session?.user?.role;
  const pathName = req.nextUrl.pathname;
  if (!validateProtectedPageAccess(role, pathName)) {
    return NextResponse.redirect(loginUrl);
  }

  if (pathName.startsWith("/admin") && pathName !== "/admin/login") {
    if (!validateAdminPageAccess(role)) {
      return NextResponse.redirect(adminLoginUrl);
    }
  }
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
