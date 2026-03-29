"use server";

import { getCurrentUser, updatePincode } from "@/server/db/queries/account";
import { Role } from "@prisma/client";

export const adminResetUserPinAction = async (
  userId: number,
  newPin: string,
) => {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser.ok || adminUser.user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "Unauthorized: Only admins can perform this action.",
      };
    }

    if (!/^\d{4,10}$/.test(newPin)) {
      return {
        success: false,
        message: "PIN must be between 4 and 10 numbers.",
      };
    }

    await updatePincode(newPin, userId);

    return { success: true, message: "User PIN reset successfully." };
  } catch (error) {
    console.error("Admin PIN reset failed:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};
