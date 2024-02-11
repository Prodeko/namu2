"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ServerSession } from "@/server/session";

const tryGetSession = async () => {
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId) {
    console.info("No session found, redirecting to login");
    redirect("/login");
  }
  return ServerSession.GetSession(sessionId);
};

/**
 * Middleware to protect routes that require authentication.
 * Redirects to login if no session is found.
 */
const protectedAuthMiddleware = async () => {
  const session = await tryGetSession();
  if (!session.ok) {
    console.warn("No session found, redirecting to login");
    redirect("/login");
  }
  console.info("Session found, redirecting to shop");
  redirect("/shop");
};

/**
 * Middleware to protect routes that require admin authentication.
 * Redirects to login if no session is found or if the user is not an admin.
 */
const adminMiddleware = async () => {
  const session = await tryGetSession();
  if (!session.ok) {
    console.warn("No session found, redirecting to login");
    redirect("/login");
  }
  if (session.data.role !== "ADMIN") {
    console.warn("User is not an admin, redirecting to login");
    redirect("/login");
  }
  redirect("/admin");
};

/**
 * Middleware to protect routes that require superadmin authentication.
 * Redirects to login if no session is found or if the user is not a superadmin.
 */
const superAdminMiddleware = async () => {
  const session = await tryGetSession();
  if (!session.ok) {
    console.warn("No session found, redirecting to login");
    redirect("/login");
  }
  if (session.data.role !== "SUPERADMIN") {
    console.warn("User is not a superadmin, redirecting to login");
    redirect("/login");
  }
  redirect("/superadmin");
};

export { protectedAuthMiddleware, adminMiddleware, superAdminMiddleware };
