"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSession } from "@/auth/ironsession";
import { LoginFormState, loginFormParser } from "@/common/types";
import {
  getUserByRfidTag,
  getUserByUsername,
} from "@/server/db/queries/account";
import {
  createPincodeHash,
  createRfidTagHash,
  verifyPincode,
} from "@/server/db/utils/auth";
import { ValueError } from "@/server/exceptions/exception";

export const loginAction = async (
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {
  const pinCode = formData.get("pinCode") as string | undefined;
  const userName = formData.get("userName") as string | undefined;
  const input = loginFormParser.safeParse({
    userName,
    pinCode,
  });
  try {
    if (!pinCode) {
      throw new ValueError({
        cause: "missing_value",
        message: "PIN code is required",
      });
    }

    if (!userName) {
      throw new ValueError({
        cause: "missing_value",
        message: "Username is required",
      });
    }

    if (!input.success) {
      throw new ValueError({
        cause: "invalid_value",
        message: "Invalid username or PIN code",
      });
    }
    const data = input.data;
    const user = await getUserByUsername(data.userName);

    if (!user) {
      console.debug(
        `Request unauthorized: user with username ${data.userName} does not exist`,
      );
      throw new ValueError({
        cause: "invalid_value",
        message: "Invalid username or PIN code",
      });
    }

    const pincodeIsValid = await verifyPincode(data.pinCode, user.pinHash);
    if (!pincodeIsValid) {
      console.debug(
        `Request unauthorized: invalid PIN code for user ${user.id}`,
      );
      throw new ValueError({
        cause: "invalid_value",
        message: "Invalid username or PIN code",
      });
    }

    const nonAdminUser = {
      ...user,
      role: "USER",
    } as const;

    await createSession(nonAdminUser);
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
    return {
      userName: input.success ? input.data.userName : "",
      pinCode: input.success ? input.data.pinCode : "",
      message:
        error instanceof ValueError
          ? error.message
          : "An unexpected error occurred while logging in, try again!",
    };
  }
  revalidatePath("/shop");
  redirect("/shop");
};

export const rfidLoginAction = async (tagId: string) => {
  const idHash = await createRfidTagHash(tagId);
  const user = await getUserByRfidTag(idHash);
  if (!user) {
    console.debug(
      `Request unauthorized: user with RFID tag ${tagId} does not exist`,
    );
    throw new ValueError({
      cause: "invalid_value",
      message: "Couldn't find user with this RFID tag",
    });
  }
  const nonAdminUser = {
    ...user,
    role: "USER",
  } as const;
  await createSession(nonAdminUser);

  revalidatePath("/shop");
  redirect("/shop");
};
