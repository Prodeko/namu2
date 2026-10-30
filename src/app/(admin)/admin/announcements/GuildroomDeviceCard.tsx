"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  clearGuildroomDeviceCookie,
  isGuildroomDeviceCookieSet,
  setGuildroomDeviceCookie,
} from "@/common/guildroomDevice";

import { Toggle } from "./Toggle";

/**
 * Marks the browser this page is open in as the guildroom tablet, or clears the
 * flag again. Does the same thing as opening the app with `?guildroom=true`,
 * which is unreachable while signed in because middleware only handles that
 * parameter for logged-out visitors.
 */
export const GuildroomDeviceCard = () => {
  const [isTablet, setIsTablet] = useState(false);

  // Deferred to an effect: reading document.cookie during render would not
  // match the server-rendered markup.
  useEffect(() => setIsTablet(isGuildroomDeviceCookieSet()), []);

  const toggle = () => {
    const next = !isTablet;
    if (next) {
      setGuildroomDeviceCookie();
    } else {
      clearGuildroomDeviceCookie();
    }
    setIsTablet(next);
    toast.success(
      next
        ? "This device is now the guildroom tablet. Reload to apply it everywhere."
        : "Guildroom tablet setting removed from this device. Reload to apply it everywhere.",
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-neutral-100 p-5 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium text-neutral-800 md:text-xl">
          Guildroom tablet
        </span>
        <span className="text-sm text-neutral-500">
          Marks this browser as the guildroom tablet: enables RFID card login
          and QR-code sign-in, and signs users fully out of Prodeko SSO on
          logout. Applies to this browser only.
        </span>
        <span className="mt-1 text-sm font-medium text-neutral-800">
          {isTablet
            ? "This device is the guildroom tablet"
            : "This device is not the guildroom tablet"}
        </span>
      </div>
      <Toggle on={isTablet} disabled={false} onClick={toggle} />
    </div>
  );
};
