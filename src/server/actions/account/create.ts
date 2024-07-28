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
  const formConfirmPinCode = formData.get("confirmPinCode") as
    | string
    | undefined;
  const input = createAccountFormParser.safeParse({
    firstName: formFirstName,
    lastName: formLastName,
    userName: formUserName,
    pinCode: formPinCode,
    confirmPinCode: formConfirmPinCode,
  });
  try {
    if (!formFirstName) {
      throw new ValueError({
        cause: "missing_value",
        message: "First name is required",
      });
    }

    if (!formLastName) {
      throw new ValueError({
        cause: "missing_value",
        message: "Last name is required",
      });
    }

    if (!formUserName) {
      throw new ValueError({
        cause: "missing_value",
        message: "Username is required",
      });
    }

    if (!formPinCode) {
      throw new ValueError({
        cause: "missing_value",
        message: "PIN code is required",
      });
    }

    if (!formConfirmPinCode) {
      throw new ValueError({
        cause: "missing_value",
        message: "Confirming PIN code is required",
      });
    }

    if (!input.success) {
      throw new ValueError({
        cause: "invalid_value",
        message: "Invalid form data",
      });
    }

    if (formPinCode !== formConfirmPinCode) {
      throw new ValueError({
        cause: "invalid_value",
        message: "PIN codes do not match",
      });
    }

    const data = input.data;

    await db.$transaction(async (tx) => {
      const newUser = await createUserAccount(tx, data);
      const session = await createSession(newUser);
      if (!session) {
        throw new InternalServerError({
          message: "Failed to create session",
        });
      }
    });
  } catch (error) {
    if (error instanceof ValueError || error instanceof InternalServerError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
    return {
      firstName: input.success ? input.data.firstName : "",
      lastName: input.success ? input.data.lastName : "",
      userName: input.success ? input.data.userName : "",
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
