"use server";

import { getServerSession } from "next-auth";

import { getAppSession } from "@/auth/session";
import { authOptions } from "@/lib/auth";
import { db } from "@/server/db/prisma";

/**
 * Handles the Keycloak OIDC callback — supports login, linking, and signup modes.
 * Called from the /auth/callback page after Auth.js completes the OAuth exchange.
 */
export async function handleKeycloakCallback(): Promise<{
  success: boolean;
  message: string;
  redirectUrl?: string;
}> {
  try {
    const appSession = await getAppSession();
    const kcSession = await getServerSession(authOptions);

    if (!kcSession?.user) {
      return {
        success: false,
        message: "Keycloak authentication failed. Please try again.",
      };
    }

    const kcUser = kcSession.user as Record<string, unknown>;
    const keycloakSub = kcUser.keycloakSub as string | undefined;
    const email = (kcUser.email as string | undefined) ?? "";
    const firstName = (kcUser.given_name as string | undefined) ?? "";
    const lastName = (kcUser.family_name as string | undefined) ?? "";

    if (!keycloakSub) {
      return {
        success: false,
        message: "Missing Keycloak subject claim. Please try again.",
      };
    }

    // MODE 1: User is already logged into Namu — link the accounts
    if (appSession?.user?.userId) {
      return await linkKeycloakAccount(keycloakSub, email);
    }

    // MODE 2: No Namu session — try to log in via Keycloak sub
    const kcUser2 = await db.keycloakUser.findUnique({
      where: { keycloakSub },
      include: { user: true },
    });

    if (!kcUser2) {
      // MODE 3: No linked account — redirect to signup with Keycloak data prefilled
      return {
        success: false,
        message: "signup",
        redirectUrl: `/newaccount?kcSub=${encodeURIComponent(keycloakSub)}&kcEmail=${encodeURIComponent(email)}&kcFirstName=${encodeURIComponent(firstName)}&kcLastName=${encodeURIComponent(lastName)}`,
      };
    }

    return {
      success: true,
      message: `Welcome back, ${kcUser2.user.firstName}!`,
    };
  } catch (error) {
    console.error("Error in handleKeycloakCallback:", error);
    return {
      success: false,
      message: "An unexpected error occurred during authentication.",
    };
  }
}

/**
 * Links a Keycloak account to the currently logged-in Namu user.
 */
export async function linkKeycloakAccount(
  keycloakSub: string,
  email?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.userId;

    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Check if this Keycloak account is already linked to another user
    const existingLink = await db.keycloakUser.findUnique({
      where: { keycloakSub },
    });

    if (existingLink) {
      if (existingLink.userId === userId) {
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

    // Check if the current user already has a Keycloak account linked
    const existingUserLink = await db.keycloakUser.findUnique({
      where: { userId },
    });

    if (existingUserLink) {
      return {
        success: false,
        message: "Your account is already linked to a Prodeko account",
      };
    }

    await db.keycloakUser.create({
      data: {
        userId,
        keycloakSub,
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
 * Checks if the current user has a Keycloak account linked.
 */
export async function getKeycloakLinkStatus(): Promise<{
  isLinked: boolean;
  email?: string;
}> {
  try {
    const session = await getAppSession();
    const userId = session?.user?.userId;

    if (!userId) {
      return { isLinked: false };
    }

    const kcUser = await db.keycloakUser.findUnique({
      where: { userId },
    });

    return {
      isLinked: !!kcUser,
      email: kcUser?.email || undefined,
    };
  } catch (error) {
    console.error("Error checking Prodeko account link status:", error);
    return { isLinked: false };
  }
}
