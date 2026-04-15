"use client";

import { useQuery } from "@tanstack/react-query";
import { useQRCode } from "next-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";

import { AnimatedPopup, type PopupRefActions } from "@/components/ui/AnimatedPopup";
import {
  createKeycloakLinkSession,
  getKeycloakLinkSessionStatus,
} from "@/server/actions/auth/qrLinkSession";

interface Props {
  children: React.ReactNode;
}

export const LinkProdekoQrDialog = ({ children }: Props) => {
  const popupRef = useRef<PopupRefActions>(undefined);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [linked, setLinked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { Canvas } = useQRCode();

  const createSession = useCallback(async () => {
    setCreating(true);
    setError(null);
    setLinked(false);
    setSessionId(null);
    setQrUrl(null);

    const result = await createKeycloakLinkSession();
    if (result.ok) {
      setSessionId(result.id);
      setQrUrl(result.url);
    } else {
      setError(result.message);
    }
    setCreating(false);
  }, []);

  const handleOpen = useCallback(() => {
    createSession();
  }, [createSession]);

  const { data: sessionStatus } = useQuery({
    queryKey: ["kc-link-session", sessionId],
    queryFn: () => getKeycloakLinkSessionStatus(sessionId!),
    enabled: !!sessionId && !linked,
    refetchInterval: (data) => {
      if (
        data?.status === "COMPLETED" ||
        data?.status === "EXPIRED" ||
        data?.status === "NOT_FOUND"
      ) {
        return false;
      }
      return 3000;
    },
  });

  // React to status changes via useEffect
  useEffect(() => {
    if (!sessionStatus) return;
    if (sessionStatus.status === "COMPLETED") {
      setLinked(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else if (
      sessionStatus.status === "EXPIRED" ||
      sessionStatus.status === "NOT_FOUND"
    ) {
      setError("QR code expired. Please try again.");
      setSessionId(null);
      setQrUrl(null);
    }
  }, [sessionStatus]);

  const handleClose = () => {
    setSessionId(null);
    setQrUrl(null);
    setLinked(false);
    setError(null);
    popupRef.current?.closeContainer();
  };

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={children} onOpen={handleOpen}>
      <div className="flex w-full flex-col items-center gap-6 px-5 py-6 md:gap-8 md:px-12 md:py-10">
        {/* Header */}
        <div className="-mb-2 flex w-full items-center justify-between">
          <p className="text-xl font-bold text-primary-400 md:text-3xl">
            Link Prodeko Account
          </p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
            onClick={handleClose}
          >
            <HiX />
          </div>
        </div>

        {/* Loading state */}
        {creating && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
            <p className="text-center text-gray-600">Generating QR code...</p>
          </div>
        )}

        {/* QR code */}
        {!creating && qrUrl && !linked && !error && (
          <div className="flex flex-col items-center gap-4">
            <Canvas
              text={qrUrl}
              options={{
                color: {
                  dark: "#303030FF",
                  light: "#00000000",
                },
                width: 220,
              }}
            />
            <p className="text-center text-base text-gray-600 md:text-lg">
              Scan this QR code with your phone to link your Prodeko account.
            </p>
            <p className="text-center text-sm text-gray-400">
              The code expires in 10 minutes.
            </p>
          </div>
        )}

        {/* Success state */}
        {linked && (
          <div className="flex flex-col items-center gap-4 py-8">
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
            <p className="text-center text-lg font-semibold text-gray-800">
              Prodeko account linked!
            </p>
          </div>
        )}

        {/* Error / expired state */}
        {error && !creating && (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-red-600">{error}</p>
            <button
              type="button"
              onClick={createSession}
              className="rounded-lg bg-primary-400 px-6 py-2 text-white hover:bg-primary-500"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </AnimatedPopup>
  );
};
