"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/auth/ironsession";
import { getUserById, setNfcSerialHash } from "@/server/db/queries/account";
import { createRfidTagHash } from "@/server/db/utils/auth";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";

export const setNfcLogin = async (tagId: string) => {
  try {
    const session = await getSession();
    if (!session) {
      throw new InvalidSessionError({
        message: "Session is missing",
        cause: "missing_session",
      });
    }
    if (!session.user) {
      throw new InvalidSessionError({
        cause: "missing_role",
        message: "User role is missing",
      });
    }
    const user = await getUserById(session.user.userId);
    if (!user) {
      console.debug(`User with id ${session.user.userId} does not exist`);
      throw new ValueError({
        cause: "invalid_value",
        message: "Error fetching user, please log in again.",
      });
    }

    const idHash = await createRfidTagHash(tagId);
    await setNfcSerialHash(idHash, user.id);
  } catch (error: any) {
    return { message: error?.message || "Unknown error occurred." };
  }

  revalidatePath("/account");
};
