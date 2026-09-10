/**
 * The single definition of the "this browser is the guildroom tablet" cookie.
 *
 * Kept free of imports on purpose: this module is used from `src/middleware.ts`,
 * which runs on the edge runtime, so it must not pull in Prisma or anything
 * server-only. That is also why it does not live in `src/common/utils.ts`.
 *
 * Written from two places — the `?guildroom=true` shortcut in middleware and the
 * toggle on the admin announcements page — and read by `getDeviceType`
 * (client) and `getServerDeviceType` (server).
 */

export const GUILDROOM_COOKIE_NAME = "is_guildroom_device";

export const GUILDROOM_COOKIE_VALUE = "1";

/** 10 years. The tablet is set up once and never signed out. */
export const GUILDROOM_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10;

/** Cookie attributes shared by every writer, so they cannot drift apart. */
export const guildroomCookieOptions = () => ({
  maxAge: GUILDROOM_COOKIE_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: false, // Must be readable by client-side JS
});

/** Whether this browser is flagged as the guildroom tablet. Client-side only. */
export const isGuildroomDeviceCookieSet = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some(
      (c) => c.trim() === `${GUILDROOM_COOKIE_NAME}=${GUILDROOM_COOKIE_VALUE}`,
    );
};

/** Flag this browser as the guildroom tablet. Client-side only. */
export const setGuildroomDeviceCookie = (): void => {
  if (typeof document === "undefined") return;
  const { maxAge, path, sameSite, secure } = guildroomCookieOptions();
  const attributes = [
    `${GUILDROOM_COOKIE_NAME}=${GUILDROOM_COOKIE_VALUE}`,
    `path=${path}`,
    `max-age=${maxAge}`,
    `samesite=${sameSite}`,
  ];
  if (secure) attributes.push("secure");
  document.cookie = attributes.join("; ");
};

/**
 * Un-flag this browser. Client-side only.
 * The path must match the one used when setting, or the delete silently no-ops.
 */
export const clearGuildroomDeviceCookie = (): void => {
  if (typeof document === "undefined") return;
  const { path, sameSite, secure } = guildroomCookieOptions();
  const attributes = [
    `${GUILDROOM_COOKIE_NAME}=`,
    `path=${path}`,
    "max-age=0",
    `samesite=${sameSite}`,
  ];
  if (secure) attributes.push("secure");
  document.cookie = attributes.join("; ");
};
