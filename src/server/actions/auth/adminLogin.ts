"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession } from "@/auth/ironsession";
import { type LoginFormState, loginFormParser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { verifyPincode } from "@/server/db/utils/auth";

export const adminLoginAction = async (
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {
  const pinCode = formData.get("pinCode") as string;
  const userName = formData.get("userName") as string;
  try {
    const input = loginFormParser.parse({
      userName,
      pinCode,
    });
    const user = await db.user.findUnique({
      where: {
        userName: input.userName,
      },
    });

    // Check if user exists
    if (!user) {
      console.debug(
        `Request unauthorized: user with username ${input.userName} does not exist`,
      );
      throw new Error("Invalid username or PIN code");
    }

    // Check if PIN code is valid
    const pincodeIsValid = await verifyPincode(input.pinCode, user.pinHash);
    if (!pincodeIsValid) {
      console.debug(
        `Request unauthorized: invalid PIN code for user ${user.id}`,
      );
      throw new Error("Invalid username or PIN code");
    }

    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      console.debug(`Request unauthorized: user ${user.id} is not an admin`);
      throw new Error("This user is not an admin");
    }

    await createSession(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors.flatMap((err) => err.message).join(", "));
    } else {
      console.error(error);
    }
    return {
      userName,
      pinCode,
      message:
        error instanceof Error ? error.message : "Invalid username or PIN code",
    };
  }
  revalidatePath("/admin/restock");
  redirect("/admin/restock");
};
