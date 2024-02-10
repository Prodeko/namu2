import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ServerSession } from "@/server/session";

/**
 * Middleware to protect routes that require authentication.
 * Redirects to login if no session is found.
 */
const protectedAuthMiddleware = async () => {
  try {
    const sessionId = cookies().get("sessionId")?.value;
    if (!sessionId) {
      console.info("No session found, redirecting to login");
      redirect("/login");
    }
    return ServerSession.GetSession(sessionId);
  } catch (error) {
    console.error("Session validation failed", error);
    redirect("/login");
  }
};

/**
 * Middleware to protect routes that require admin authentication.
 * Redirects to login if no session is found or if the user is not an admin.
 */
const adminMiddleware = async () => {
  try {
    const session = await protectedAuthMiddleware();
    if (session.role !== "ADMIN") {
      console.info("User is not an admin, redirecting to login");
      redirect("/login");
    }
  } catch (error) {
    console.error("Admin validation failed", error);
    redirect("/login");
  }
};

/**
 * Middleware to protect routes that require superadmin authentication.
 * Redirects to login if no session is found or if the user is not a superadmin.
 */
const superAdminMiddleware = async () => {
  try {
    const session = await protectedAuthMiddleware();
    if (session.role !== "SUPERADMIN") {
      console.info("User is not a superadmin, redirecting to login");
      redirect("/login");
    }
  } catch (error) {
    console.error("Superadmin validation failed", error);
    redirect("/login");
  }
};

export { protectedAuthMiddleware, adminMiddleware, superAdminMiddleware };
