"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

/**
 * Tiny redirect page hit after /api/auth/link validates the QR link token
 * and sets the pending-link cookie. Calls NextAuth's signIn() which handles
 * CSRF + POST internally, so we skip the intermediate NextAuth sign-in UI
 * and land directly on the Keycloak login page.
 */
export default function LinkRedirectPage() {
  useEffect(() => {
    signIn("keycloak", { callbackUrl: "/auth/callback?intent=link-qr" });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
        <p className="text-center text-gray-600">Redirecting to Prodeko login...</p>
      </div>
    </div>
  );
}
