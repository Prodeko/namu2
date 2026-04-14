"use server";

import { getServerSession } from "next-auth";
import { decode, encode } from "next-auth/jwt";
import { cookies } from "next/headers";

import { getAppSession } from "@/auth/session";
import { authOptions } from "@/lib/auth";
import { db } from "@/server/db/prisma";

const PENDING_LINK_COOKIE = "namu-pending-kc-link";
const PENDING_LINK_MAX_AGE = 10 * 60; // 10 minutes — just long enough for the OAuth dance

const getAuthSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return secret;
};

/**
 * Called from the account page BEFORE signIn("keycloak"). Stashes the
 * currently-logged-in Namu user id in a short-lived signed HttpOnly cookie
 * so `linkKeycloakAccount` can recover it after signIn replaces the NextAuth
 * JWT cookie with a fresh Keycloak-only session.
 *
 * This cookie is separate from the NextAuth session cookie and therefore
 * survives the re-auth.
 */
export async function beginKeycloakLink(): Promise<{
  ok: boolean;
  message?: string;
}> {
  const session = await getAppSession();
  const userId = session?.user?.userId;
  if (!userId) {
    return { ok: false, message: "Not authenticated" };
  }

  const token = await encode({
    token: { pendingLinkUserId: userId },
    secret: getAuthSecret(),
    maxAge: PENDING_LINK_MAX_AGE,
  });

  const cookieStore = await cookies();
  cookieStore.set(PENDING_LINK_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_LINK_MAX_AGE,
  });

  return { ok: true };
}

const consumePendingLinkUserId = async (): Promise<number | undefined> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PENDING_LINK_COOKIE)?.value;
  if (!raw) return undefined;

  // Always clear the cookie so a stale value can't leak between flows.
  cookieStore.delete(PENDING_LINK_COOKIE);

  try {
    const decoded = await decode({ token: raw, secret: getAuthSecret() });
    const pending = decoded?.pendingLinkUserId;
    return typeof pending === "number" ? pending : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Handles the Keycloak OIDC callback — supports login, linking, and signup modes.
 * Called from the /auth/callback page after Auth.js completes the OAuth exchange.
 *
 * `intent` is carried from the UI through the `callbackUrl` query param to tell
 * login apart from link, because after a successful OAuth dance the session
 * state is otherwise identical for both flows (the jwt callback in
 * src/lib/auth.ts resolves `token.userId` for any already-linked sub).
 */
export async function handleKeycloakCallback(
  intent?: "login" | "link",
): Promise<{
  success: boolean;
  message: string;
  redirectUrl?: string;
  kind?: "login" | "link" | "signup";
}> {
  try {
    const kcSession = await getServerSession(authOptions);

    if (!kcSession?.user) {
      return {
        success: false,
        message: "Keycloak authentication failed. Please try again.",
      };
    }

    const keycloakSub = kcSession.user.keycloakSub;
    const email = kcSession.user.email ?? "";

    if (!keycloakSub) {
      return {
        success: false,
        message: "Missing Keycloak subject claim. Please try again.",
      };
    }

    // MODE 1: explicit link intent — the user is logged into Namu and clicked
    // "Link Prodeko" on the account page. The pending userId was stashed in a
    // short-lived signed cookie by beginKeycloakLink before signIn("keycloak")
    // replaced the NextAuth session cookie.
    if (intent === "link") {
      const pendingUserId = await consumePendingLinkUserId();
      if (!pendingUserId) {
        return {
          success: false,
          message:
            "Link session expired. Please go back to your account page and try again.",
          kind: "link",
        };
      }
      return {
        ...(await linkKeycloakAccount(pendingUserId, keycloakSub, email)),
        kind: "link",
      };
    }

    // MODE 2: login intent (default) — look up the sub and return the linked user.
    const kcUser2 = await db.keycloakUser.findUnique({
      where: { keycloakSub },
      include: { user: true },
    });

    if (!kcUser2) {
      // MODE 3: No linked account — redirect to signup. The signup page reads
      // the Keycloak identity from the live server session, not from the URL,
      // so we do not pass sub/email as query params.
      return {
        success: false,
        message: "signup",
        redirectUrl: `/newaccount`,
        kind: "signup",
      };
    }

    return {
      success: true,
      message: `Welcome back, ${kcUser2.user.firstName}!`,
      kind: "login",
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
 * Links a Keycloak account to the given Namu user id. Internal helper — not
 * exported as a standalone server action so an attacker cannot POST it with
 * an arbitrary userId. The caller is `handleKeycloakCallback`, which obtains
 * the userId from the pending-link cookie set by `beginKeycloakLink`.
 */
async function linkKeycloakAccount(
  userId: number,
  keycloakSub: string,
  email?: string,
): Promise<{ success: boolean; message: string }> {
  try {
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
