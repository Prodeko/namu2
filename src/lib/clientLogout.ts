"use client";

import { signOut } from "next-auth/react";

import { logoutAction } from "@/server/actions/auth/logout";

export const performLogout = async (receiptId?: string) => {
  const { logoutUrl } = await logoutAction(receiptId, false);
  await signOut({ redirect: false });
  window.location.href = logoutUrl;
};
