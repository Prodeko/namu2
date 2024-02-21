"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession } from "@/auth/ironsession";
import {
  CreateAccountFormState,
  createAccountFormParser,
} from "@/common/types";
import { createUserAccount } from "@/server/db/utils/account";

export const createAccountAction = async (
  prevState: CreateAccountFormState,
  formData: FormData,
): Promise<CreateAccountFormState> => {
  const formFirstName = formData.get("firstName") as string;
  const formLastName = formData.get("lastName") as string;
  const formUserName = formData.get("userName") as string;
  const formPinCode = formData.get("pinCode") as string;
  const formConfirmPinCode = formData.get("confirmPinCode") as string;
  try {
    const { firstName, lastName, userName, pinCode } =
      createAccountFormParser.parse({
        firstName: formFirstName,
        lastName: formLastName,
        userName: formUserName,
        pinCode: formPinCode,
        confirmPinCode: formConfirmPinCode,
      });
    const newUser = await createUserAccount({
      firstName,
      lastName,
      userName,
      pinCode,
    });

    // Create session
    await createSession(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors.flatMap((err) => err.message).join(", "));
    } else {
      console.error(error);
    }
    return {
      firstName: formFirstName,
      lastName: formLastName,
      userName: formUserName,
      pinCode: formPinCode,
      confirmPinCode: formConfirmPinCode,
    };
  }
  revalidatePath("/shop");
  redirect("/shop");
};
