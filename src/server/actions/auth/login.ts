"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession } from "@/auth/ironsession";
import { LoginFormState, loginFormParser } from "@/common/types";
import { db } from "@/server/db/prisma";

export const loginAction = async (
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
    const pincodeIsValid = await bcrypt.compare(input.pinCode, user.pinHash);
    if (!pincodeIsValid) {
      console.debug(
        `Request unauthorized: invalid PIN code for user ${user.id}`,
      );
      throw new Error("Invalid username or PIN code");
    }

    // Create session
    const durationInMinutes = 15;
    await createSession(user, durationInMinutes);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors.flatMap((err) => err.message).join(", "));
    } else {
      console.error(error);
    }
    return {
      userName,
      pinCode,
      message: "Invalid username or PIN code",
    };
  }
  revalidatePath("/shop");
  redirect("/shop");
};
