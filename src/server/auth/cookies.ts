import { decode, encode } from "next-auth/jwt";

export const KEYCLOAK_PENDING_LINK_COOKIE = "namu-pending-kc-link";
export const LINK_COOKIE_MAX_AGE_SECONDS = 10 * 60;

const getAuthSecret = (): string => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return secret;
};

export async function encodeAuthCookie<T extends Record<string, unknown>>(
  payload: T,
  maxAge: number = LINK_COOKIE_MAX_AGE_SECONDS,
): Promise<string> {
  return encode({ token: payload, secret: getAuthSecret(), maxAge });
}

export async function decodeAuthCookie<T extends Record<string, unknown>>(
  raw: string,
): Promise<T | null> {
  try {
    const decoded = await decode({ token: raw, secret: getAuthSecret() });
    return (decoded as T) ?? null;
  } catch {
    return null;
  }
}
