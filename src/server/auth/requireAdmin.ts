import { getAppSession } from "@/auth/session";
import { InvalidSessionError } from "@/server/exceptions/exception";
import { Role } from "@prisma/client";

/**
 * Assert that the caller is an admin, and return their session.
 *
 * Middleware only guards page routes, so a server action that acts on an
 * arbitrary `userId` has to check the role itself — otherwise any signed-in
 * user can call it straight from the client bundle.
 */
export const requireAdminSession = async () => {
  const session = await getAppSession();
  const role = session?.user?.role;
  if (role !== Role.ADMIN && role !== Role.SUPERADMIN) {
    throw new InvalidSessionError({
      message: "Admin privileges required",
      cause: "invalid_role",
    });
  }
  return session;
};
