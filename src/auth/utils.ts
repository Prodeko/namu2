import type { Session } from "@/auth/ironsession";
import { InvalidSessionError } from "@/server/exceptions/exception";

const isAuthenticated = (session: Session | undefined): boolean => {
  try {
    if (!session) {
      throw new InvalidSessionError({
        message: "Session is missing",
        cause: "missing_session",
      });
    }
    if (!session.user.role) {
      throw new InvalidSessionError({
        message: "Session role is missing",
        cause: "missing_role",
      });
    }
    return true;
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(
        `Error occurred when checking for authentication: ${error}`,
      );
    }
    return false;
  }
};

const isAdminAccount = (session: Session | undefined): boolean => {
  try {
    if (!session) {
      throw new InvalidSessionError({
        message: "Session is missing",
        cause: "missing_session",
      });
    }
    const role = session.user.role;
    if (!role) {
      throw new InvalidSessionError({
        message: "Session role is missing",
        cause: "missing_role",
      });
    }
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      throw new InvalidSessionError({
        message: "Account is not an admin",
        cause: "invalid_role",
      });
    }
    return true;
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(`Error occurred when checking for admin account: ${error}`);
    }
    return false;
  }
};

const isSuperadminAccount = (session: Session | undefined): boolean => {
  try {
    if (!session) {
      throw new InvalidSessionError({
        message: "Session is missing",
        cause: "missing_session",
      });
    }
    const role = session.user.role;
    if (!role) {
      throw new InvalidSessionError({
        message: "Session role is missing",
        cause: "missing_role",
      });
    }
    if (role !== "SUPERADMIN") {
      throw new InvalidSessionError({
        message: "Account is not a superadmin",
        cause: "invalid_role",
      });
    }
    return true;
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(
        `Error occurred when checking for superadmin account: ${error}`,
      );
    }
    return false;
  }
};

const isUserAccount = (session: Session | undefined): boolean => {
  try {
    if (!session) {
      throw new InvalidSessionError({
        message: "Session is missing",
        cause: "missing_session",
      });
    }
    const role = session.user.role;
    if (!role) {
      throw new InvalidSessionError({
        message: "Session role is missing",
        cause: "missing_role",
      });
    }
    if (role !== "USER") {
      throw new InvalidSessionError({
        message: "Account is not a user",
        cause: "invalid_role",
      });
    }
    return true;
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(`Error occurred when checking for user account: ${error}`);
    }
    return false;
  }
};

export { isAuthenticated, isAdminAccount, isSuperadminAccount, isUserAccount };
