"use server";

import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

import { getAppSession } from "@/auth/session";
import { authOptions } from "@/lib/auth";
import {
  KEYCLOAK_PENDING_LINK_COOKIE,
  KEYCLOAK_PENDING_LINK_SESSION_COOKIE,
  LINK_COOKIE_MAX_AGE_SECONDS,
  decodeAuthCookie,
  encodeAuthCookie,
} from "@/server/auth/cookies";
import { consumeKeycloakLinkSession } from "@/server/auth/keycloakLinkSession";
import { db } from "@/server/db/prisma";

/**
 * Called from the account page BEFORE signIn("keycloak"). Stashes the
 * currently-logged-in Namu user id in a short-lived signed HttpOnly cookie
 * so `linkKeycloakAccount` can recover it after signIn replaces the NextAuth
 * JWT cookie with a fresh Keycloak-only session.
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

  const token = await encodeAuthCookie({ pendingLinkUserId: userId });

  const cookieStore = await cookies();
  cookieStore.set(KEYCLOAK_PENDING_LINK_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: LINK_COOKIE_MAX_AGE_SECONDS,
  });

  return { ok: true };
}

const consumePendingLinkUserId = async (): Promise<number | undefined> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(KEYCLOAK_PENDING_LINK_COOKIE)?.value;
  if (!raw) return undefined;

  cookieStore.delete(KEYCLOAK_PENDING_LINK_COOKIE);

  const decoded = await decodeAuthCookie<{ pendingLinkUserId: unknown }>(raw);
  const pending = decoded?.pendingLinkUserId;
  return typeof pending === "number" ? pending : undefined;
};

const consumePendingLinkSessionId = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(KEYCLOAK_PENDING_LINK_SESSION_COOKIE)?.value;
  if (!raw) return undefined;

  cookieStore.delete(KEYCLOAK_PENDING_LINK_SESSION_COOKIE);

  const decoded = await decodeAuthCookie<{ pendingLinkSessionId: unknown }>(
    raw,
  );
  const pending = decoded?.pendingLinkSessionId;
  return typeof pending === "string" ? pending : undefined;
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
  intent?: "login" | "link" | "link-qr",
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

    // MODE 2: QR link intent — the user scanned a tablet QR code on their phone.
    // The pending link session id was stored in a signed cookie by the
    // /api/auth/link route handler before starting the OAuth dance.
    if (intent === "link-qr") {
      const pendingLinkSessionId = await consumePendingLinkSessionId();
      if (!pendingLinkSessionId) {
        return {
          success: false,
          message:
            "Link session cookie missing or invalid. Please scan the QR code again.",
          kind: "link",
        };
      }

      const consumed = await consumeKeycloakLinkSession(
        pendingLinkSessionId,
        keycloakSub,
      );
      if (!consumed) {
        return {
          success: false,
          message:
            "Link session expired or already used. Please scan the QR code again.",
          kind: "link",
        };
      }

      return {
        ...(await linkKeycloakAccount(consumed.userId, keycloakSub, email)),
        kind: "link",
      };
    }

    // MODE 3: login intent (default) — look up the sub and return the linked user.
    const kcUser = await db.keycloakUser.findUnique({
      where: { keycloakSub },
      include: { user: true },
    });

    if (!kcUser) {
      // No linked account — redirect to signup. The signup page reads the
      // Keycloak identity from the live server session, not from the URL,
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
      message: `Welcome back, ${kcUser.user.firstName}!`,
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
 * the userId from the pending-link cookie set by `beginKeycloakLink` or the
 * QR link session consumed by `consumeKeycloakLinkSession`.
 */
async function linkKeycloakAccount(
  userId: number,
  keycloakSub: string,
  email?: string,
): Promise<{ success: boolean; message: string }> {
  try {
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
