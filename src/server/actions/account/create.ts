"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSession } from "@/auth/ironsession";
import {
  CreateAccountFormState,
  createAccountFormParser,
} from "@/common/types";
import { db } from "@/server/db/prisma";
import { createUserAccount } from "@/server/db/utils/account";
import { InternalServerError, ValueError } from "@/server/exceptions/exception";

export const createAccountAction = async (
  prevState: CreateAccountFormState,
  formData: FormData,
): Promise<CreateAccountFormState> => {
  const formFirstName = formData.get("firstName") as string | undefined;
  const formLastName = formData.get("lastName") as string | undefined;
  const formUserName = formData.get("userName") as string | undefined;
  const formPinCode = formData.get("pinCode") as string | undefined;
  const legacyAccountId = formData.get("legacyAccountId") as string | undefined;
  const formConfirmPinCode = formData.get("confirmPinCode") as
    | string
    | undefined;
  const input = createAccountFormParser.safeParse({
    firstName: formFirstName,
    lastName: formLastName,
    userName: formUserName,
    pinCode: formPinCode,
    confirmPinCode: formConfirmPinCode,
    legacyAccountId: legacyAccountId ? parseInt(legacyAccountId) : undefined,
  });
  console.log(input);
  try {
    if (!formConfirmPinCode) {
      throw new ValueError({
        cause: "missing_value",
        message: "Confirming PIN code is required",
      });
    }

    if (!input.success) {
      const error = input.error.issues[0]?.message || "Invalid form data";
      throw new ValueError({
        cause: "invalid_value",
        message: error,
      });
    }

    if (formPinCode !== formConfirmPinCode) {
      input.data.pinCode = "";
      input.data.confirmPinCode = "";
      throw new ValueError({
        cause: "invalid_value",
        message: "PIN codes do not match",
      });
    }

    const data = input.data;
    const newUser = await createUserAccount(db, data);
    await createSession(newUser);
  } catch (error) {
    if (error instanceof ValueError || error instanceof InternalServerError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }

    return {
      firstName: formFirstName || "",
      lastName: formLastName || "",
      userName: formUserName || "",
      pinCode: input.success ? input.data.pinCode : "",
      confirmPinCode: input.success ? input.data.confirmPinCode : "",
      message:
        error instanceof ValueError || error instanceof InternalServerError
          ? error.message
          : "An unexpected error occurred while creating a new account, try again!",
    };
  }
  revalidatePath("/shop");
  redirect("/shop");
};
