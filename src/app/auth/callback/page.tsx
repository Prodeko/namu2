"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { handleAuth0Callback } from "@/server/actions/auth/linkAuth0";

export default function Auth0CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [message, setMessage] = useState("Linking your account...");

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleAuth0Callback();
        if (result.success) {
          setStatus("success");
          setMessage(result.message);
          // Redirect to account page after a short delay
          setTimeout(() => {
            router.push("/account");
          }, 1500);
        } else {
          setStatus("error");
          setMessage(result.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred");
        console.error("Callback error:", error);
      }
    };

    processCallback();
  }, [router]);

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
                Error Occurred
              </h2>
              <p className="text-center text-gray-600">{message}</p>
              <button
                onClick={() => router.push("/account")}
                className="mt-4 rounded-lg bg-primary-400 px-6 py-2 text-white hover:bg-primary-500"
              >
                Back to Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
