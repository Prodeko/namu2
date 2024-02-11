"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { removeSession } from "@/auth/ironsession";

export const logoutAction = async () => {
  try {
    await removeSession();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to logout: ${error.message}`);
    }
    console.error("Failed to logout");
  }
  revalidatePath("/");
  redirect("/");
};
