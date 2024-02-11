"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { LoginFormState, loginFormParser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ServerSession } from "@/server/session";

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
    const response = await ServerSession.SaveSession({
      userId: user.id,
      role: user.role,
      durationInMinutes,
    });

    if (!response.ok) {
      throw new Error(response.error.message);
    }
    const sessionId = response.data;
    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "lax", // Helps with CSRF
      maxAge: durationInMinutes * 1000, // Cookie expiration matches Redis
    });

    // Optionally, you can send a response back to the client
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
