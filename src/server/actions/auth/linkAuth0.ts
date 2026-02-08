"use server";

import { createSession, getSession } from "@/auth/ironsession";
import { auth0 } from "@/lib/auth0";
import { db } from "@/server/db/prisma";

/**
 * Handles the Auth0 callback - supports login, linking, and signup modes
 * This is called from the callback page component
 */
export async function handleAuth0Callback(): Promise<{
  success: boolean;
  message: string;
  redirectUrl?: string;
}> {
  try {
    // Get both sessions
    const namuSession = await getSession();
    const auth0Session = await auth0.getSession();

    if (!auth0Session?.user) {
      return {
        success: false,
        message: "Auth0 authentication failed. Please try again.",
      };
    }

    // MODE 1: User is already logged into Namu - link the accounts
    if (namuSession?.user?.userId) {
      const result = await linkAuth0Account(
        auth0Session.user.sub,
        auth0Session.user.email,
      );
      return result;
    }

    // MODE 2: User is not logged into Namu - try to log them in via Auth0
    const auth0User = await db.auth0User.findUnique({
      where: { auth0Sub: auth0Session.user.sub },
      include: { user: true },
    });

    if (!auth0User) {
      // MODE 3: No linked account exists - redirect to signup with Auth0 data
      // Extract name parts from Auth0 user data
      const firstName = auth0Session.user.given_name || "";
      const lastName = auth0Session.user.family_name || "";
      const email = auth0Session.user.email || "";
      const auth0Sub = auth0Session.user.sub;

      return {
        success: false,
        message: "signup",
        redirectUrl: `/newaccount?auth0Sub=${encodeURIComponent(auth0Sub)}&auth0Email=${encodeURIComponent(email)}&auth0FirstName=${encodeURIComponent(firstName)}&auth0LastName=${encodeURIComponent(lastName)}`,
      };
    }

    // Log the user in by creating a Namu session
    await createSession(auth0User.user);

    return {
      success: true,
      message: `Welcome back, ${auth0User.user.firstName}!`,
    };
  } catch (error) {
    console.error("Error in handleAuth0Callback:", error);
    return {
      success: false,
      message: "An unexpected error occurred during authentication.",
    };
  }
}

/**
 * Links an Auth0 account to the currently logged-in user
 * @param auth0Sub - The Auth0 user ID (sub claim)
 * @param email - The email from Auth0 (optional)
 * @returns Success or error message
 */
export async function linkAuth0Account(
  auth0Sub: string,
  email?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getSession();
    const userId = session?.user?.userId;

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Check if this Auth0 account is already linked to another user
    const existingAuth0User = await db.auth0User.findUnique({
      where: { auth0Sub },
    });

    if (existingAuth0User) {
      if (existingAuth0User.userId === userId) {
        return {
          success: true,
          message: "Prodeko account already linked to your account",
        };
      }
      return {
        success: false,
        message: "This Prodeko account is already linked to another user",
      };
    }

    // Check if the current user already has an Auth0 account linked
    const existingUserLink = await db.auth0User.findUnique({
      where: { userId },
    });

    if (existingUserLink) {
      return {
        success: false,
        message: "Your account is already linked to an Auth0 account",
      };
    }

    // Create the link
    await db.auth0User.create({
      data: {
        userId,
        auth0Sub,
        email: email || null,
      },
    });

    return { success: true, message: "Prodeko account linked successfully!" };
  } catch (error) {
    console.error("Error linking Prodeko account:", error);
    return { success: false, message: "Failed to link Prodeko account" };
  }
}

/**
 * Checks if the current user has an Auth0 account linked
 * @returns Auth0User info or null
 */
export async function getAuth0LinkStatus(): Promise<{
  isLinked: boolean;
  email?: string;
}> {
  try {
    const session = await getSession();
    const userId = session?.user?.userId;

    if (!userId) {
      return { isLinked: false };
    }

    const auth0User = await db.auth0User.findUnique({
      where: { userId },
    });

    return {
      isLinked: !!auth0User,
      email: auth0User?.email || undefined,
    };
  } catch (error) {
    console.error("Error checking Prodeko Account link status:", error);
    return { isLinked: false };
  }
}
