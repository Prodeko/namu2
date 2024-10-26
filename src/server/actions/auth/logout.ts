"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession, removeSession } from "@/auth/ironsession";

export const logoutAction = async (showReceipt?: boolean) => {
  try {
    const session = await getSession();
    await removeSession();
    console.info(`Logout successful for user ${session?.user?.userId}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to logout: ${error.message}`);
    }
    console.error("Failed to logout");
  }
  revalidatePath("/login");
  if (showReceipt) redirect("/login?loggedOut=true&showReceipt=true");
  else redirect("/login?loggedOut=true");
};
