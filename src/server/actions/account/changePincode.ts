"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/auth/ironsession";
import { ChangePinFormState, changePinFormParser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { updatePincode } from "@/server/db/utils/account";
import { verifyPincode } from "@/server/db/utils/auth";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";

export const changePincodeAction = async (
  prevState: ChangePinFormState,
  formData: FormData,
): Promise<ChangePinFormState> => {
  const formOldPincode = formData.get("oldPincode") as string | undefined;
  const formNewPincode = formData.get("newPincode") as string | undefined;
  const formConfirmNewPincode = formData.get("confirmNewPincode") as
    | string
    | undefined;
  const input = changePinFormParser.safeParse({
    newPincode: formNewPincode,
    oldPincode: formOldPincode,
    confirmNewPincode: formConfirmNewPincode,
  });
  try {
    if (!formOldPincode) {
      throw new ValueError({
        cause: "missing_value",
        message: "Old PIN code is missing",
      });
    }

    if (!formNewPincode) {
      throw new ValueError({
        cause: "missing_value",
        message: "New PIN code is missing",
      });
    }

    if (!formConfirmNewPincode) {
      throw new ValueError({
        cause: "missing_value",
        message: "Confirm new PIN code is missing",
      });
    }

    if (!input.success) {
      console.debug("Zod parser failed for changePinFormParser");
      throw new ValueError({
        cause: "invalid_value",
        message: "Some of the fields are invalid",
      });
    }

    const { oldPincode, newPincode, confirmNewPincode } = input.data;

    const session = await getSession();
    if (!session) {
      throw new InvalidSessionError({
        cause: "missing_session",
        message: "Session is missing",
      });
    }

    if (!session.user) {
      throw new InvalidSessionError({
        cause: "missing_role",
        message: "User role is missing",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.userId,
      },
    });
    if (!user) {
      console.debug(`User with id ${session.user.userId} does not exist`);
      throw new ValueError({
        cause: "invalid_value",
        message: "The user was not found",
      });
    }

    const pincodeIsValid = await verifyPincode(oldPincode, user.pinHash);
    if (!pincodeIsValid) {
      throw new ValueError({
        cause: "invalid_value",
        message: "Invalid old PIN code",
      });
    }

    if (newPincode !== confirmNewPincode) {
      throw new ValueError({
        cause: "invalid_value",
        message: "PIN codes do not match",
      });
    }

    await updatePincode(newPincode, user.id);
  } catch (error) {
    if (error instanceof ValueError || error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
    return {
      oldPincode: input.success ? input.data.oldPincode : "",
      newPincode: input.success ? input.data.newPincode : "",
      confirmNewPincode: input.success ? input.data.confirmNewPincode : "",
      message:
        error instanceof ValueError || error instanceof InvalidSessionError
          ? error.message
          : "An unexpected error occurred while changing the pincode, try again!",
    };
  }
  revalidatePath("/account");
  redirect("/account");
};
