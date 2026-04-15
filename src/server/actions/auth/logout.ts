"use server";

import { revalidatePath } from "next/cache";

import { removeSession } from "@/auth/ironsession";
import { getAppSession } from "@/auth/session";

const KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER ?? "";

export const logoutAction = async (
  receiptId?: string,
  globalSignOut = false,
  idToken?: string,
): Promise<{ logoutUrl: string }> => {
  try {
    const session = await getAppSession();
    await removeSession();
    console.info(`Logout successful for user ${session?.user?.userId}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to logout: ${error.message}`);
    }
    console.error("Failed to logout");
  }
  revalidatePath("/");

  const appBaseUrl = process.env.NEXTAUTH_URL ?? "";
  const fallbackLoginPath = receiptId
    ? `/login?loggedOut=true&receiptId=${encodeURIComponent(receiptId)}`
    : "/login?loggedOut=true";

  if (!globalSignOut) {
    return { logoutUrl: fallbackLoginPath };
  }

  if (!KEYCLOAK_ISSUER || !idToken) {
    return { logoutUrl: fallbackLoginPath };
  }

  const postLogoutRedirectUri = appBaseUrl
    ? `${appBaseUrl}${fallbackLoginPath}`
    : fallbackLoginPath;

  const keycloakLogoutUrl =
    `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout` +
    `?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}` +
    `&id_token_hint=${encodeURIComponent(idToken)}`;

  return { logoutUrl: keycloakLogoutUrl };
};
