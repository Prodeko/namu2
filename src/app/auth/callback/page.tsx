"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { handleKeycloakCallback } from "@/server/actions/auth/linkKeycloak";

export default function KeycloakCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [message, setMessage] = useState("Linking your account...");

  useEffect(() => {
    const processCallback = async () => {
      // Check for OAuth error parameters
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || `Authentication error: ${error}`);
        return;
      }

      try {
        const result = await handleKeycloakCallback();
        if (result.success) {
          setStatus("success");
          setMessage(result.message);
          // Redirect to shop if it's a login, account page if it's a link
          const redirectPath = result.message.includes("Welcome back")
            ? "/shop"
            : "/account";
          setTimeout(() => {
            router.push(redirectPath);
          }, 1500);
        } else {
          // Check if this is a signup redirect
          if (result.message === "signup" && result.redirectUrl) {
            setMessage("Redirecting to signup...");
            router.push(result.redirectUrl);
          } else {
            setStatus("error");
            setMessage(result.message);
          }
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred");
        console.error("Callback error:", error);
      }
    };

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          {status === "processing" && (
            <>
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
              <h2 className="text-xl font-semibold text-gray-900">
                Processing...
              </h2>
              <p className="text-center text-gray-600">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Success!</h2>
              <p className="text-center text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to your account...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Authentication Error
              </h2>
              <p className="text-center text-gray-600">{message}</p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => router.push("/login")}
                  className="rounded-lg bg-primary-400 px-6 py-2 text-white hover:bg-primary-500"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="rounded-lg border border-primary-400 px-6 py-2 text-primary-400 hover:bg-primary-50"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
