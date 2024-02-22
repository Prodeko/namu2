"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getSession } from "@/auth/ironsession";
import { ChangePinFormState, changePinFormParser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { updatePincode } from "@/server/db/utils/account";

export const changePincodeAction = async (
  prevState: ChangePinFormState,
  formData: FormData,
): Promise<ChangePinFormState> => {
  const formOldPincode = formData.get("oldPincode") as string;
  const formNewPincode = formData.get("newPincode") as string;
  const formConfirmNewPincode = formData.get("confirmNewPincode") as string;
  try {
    const { oldPincode, newPincode, confirmNewPincode } =
      changePinFormParser.parse({
        newPincode: formNewPincode,
        oldPincode: formOldPincode,
        confirmNewPincode: formConfirmNewPincode,
      });

    if (newPincode !== confirmNewPincode) {
      throw new Error("PIN codes do not match");
    }

    const session = await getSession();
    if (!session?.user) {
      throw new Error("User is not logged in");
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const pincodeIsValid = await bcrypt.compare(oldPincode, user.pinHash);
    if (!pincodeIsValid) {
      throw new Error("Old PIN code is invalid");
    }

    await updatePincode(newPincode, user.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors.flatMap((err) => err.message).join(", "));
    } else {
      console.error(error);
    }
    return {
      oldPincode: formOldPincode,
      newPincode: formNewPincode,
      confirmNewPincode: formConfirmNewPincode,
    };
  }
  revalidatePath("/account");
  redirect("/account");
};
