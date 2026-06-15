"use client";

import { useEffect } from "react";

/**
 * sessionStorage key for the "already checked announcements this login" guard.
 * Cleared here on the login page and set by the shop runner after its first
 * check, so announcements fire once per login rather than on every shop visit.
 */
export const ANNOUNCEMENT_GUARD_KEY = "namu.announcementsChecked";

/**
 * Clears the once-per-login announcement guard on mount. Rendered on the login
 * page, which every sign-in method passes through (PIN, RFID, and the Prodeko
 * SSO button all live there), so any fresh login — even on a shared tablet that
 * is never logged out — re-checks announcements the next time the user lands on
 * the shop.
 */
export const AnnouncementGuardReset = () => {
  useEffect(() => {
    sessionStorage.removeItem(ANNOUNCEMENT_GUARD_KEY);
  }, []);
  return null;
};
