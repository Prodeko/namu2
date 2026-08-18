"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
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

  // Keycloak linkage, if any, is derived from the live Keycloak session on the
  // server — never from form/body input — so a caller cannot pre-link a new
  // account to someone else's Prodeko identity.
  const kcSession = await getServerSession(authOptions);
  const kcSub = kcSession?.user?.keycloakSub;
  const kcEmail = kcSession?.user?.email ?? undefined;

  const input = createAccountFormParser.safeParse({
    firstName: formFirstName,
    lastName: formLastName,
    userName: formUserName,
    pinCode: formPinCode,
    confirmPinCode: formConfirmPinCode,
    legacyAccountId: legacyAccountId ? parseInt(legacyAccountId) : undefined,
  });
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
    const newUser = await db.$transaction(async (tx) => {
      const created = await createUserAccount(tx, data);
      if (kcSub) {
        await tx.keycloakUser.create({
          data: {
            userId: created.id,
            keycloakSub: kcSub,
            email: kcEmail || null,
          },
        });
      }
      return created;
    });

    return {
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      pinCode: data.pinCode,
      confirmPinCode: data.confirmPinCode,
      legacyAccountId: data.legacyAccountId,
      message: "ACCOUNT_CREATED",
    };
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
};
