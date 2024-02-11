import { redirect } from "next/navigation";

import { getSession } from "./ironsession";

const rerouteLoggedInUser = async (path: string) => {
  const session = await getSession();
  if (session?.user) {
    console.warn(`User is already logged in, redirecting the ${path} page`);
    redirect(`/${path}`);
  }
};

/**
 * Middleware to protect routes that require authentication.
 * Redirects to login if no session is found.
 */
const verifyAuthentication = async () => {
  const session = await getSession();
  if (!session?.user) {
    console.warn("No session found, redirecting to login");
    redirect("/");
  }
};

/**
 * Middleware to protect routes that require admin authentication.
 * Redirects to login if no session is found or if the user is not an admin.
 */
const verifyAdmin = async () => {
  const session = await getSession();
  if (!session?.user) {
    console.warn("No session found, redirecting to login");
    redirect("/");
  }
  if (session.user.role !== "ADMIN") {
    console.warn("User is not an admin, redirecting to login");
    redirect("/");
  }
};

/**
 * Middleware to protect routes that require superadmin authentication.
 * Redirects to login if no session is found or if the user is not a superadmin.
 */
const verifySuperadmin = async () => {
  const session = await getSession();
  if (!session?.user) {
    console.warn("No session found, redirecting to login");
    redirect("/");
  }
  if (session.user.role !== "SUPERADMIN") {
    console.warn("User is not a superadmin, redirecting to login");
    redirect("/");
  }
};

export { verifyAuthentication, verifyAdmin, verifySuperadmin };
