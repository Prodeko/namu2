"use client";

import { getSession, signOut } from "next-auth/react";

import { getDeviceType } from "@/common/utils";
import { logoutAction } from "@/server/actions/auth/logout";
import { DeviceType } from "@prisma/client";

export const performLogout = async (receiptId?: string) => {
  const globalSignOut = getDeviceType() === DeviceType.GUILDROOM_TABLET;
  const session = globalSignOut ? await getSession() : null;
  const idToken = (session?.user as Record<string, unknown>)?.idToken as
    | string
    | undefined;
  const { logoutUrl } = await logoutAction(receiptId, globalSignOut, idToken);
  await signOut({ redirect: false });
  window.location.href = logoutUrl;
};
