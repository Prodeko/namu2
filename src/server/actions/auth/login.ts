"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSession } from "@/auth/ironsession";
import { RFID_ALLOWED_DEVICE_TYPE } from "@/common/utils";
import { db } from "@/server/db/prisma";
import { getUserByRfidTag } from "@/server/db/queries/account";
import { createRfidTagHash } from "@/server/db/utils/auth";
import { ValueError } from "@/server/exceptions/exception";
import { DeviceType, LoginMethod } from "@prisma/client";

export const rfidLoginAction = async (tagId: string) => {
  try {
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
    // RFID is only allowed on the guildroom tablet
    logUserLogin(user.id, "RFID", RFID_ALLOWED_DEVICE_TYPE);
  } catch (error: any) {
    return { error: error?.message };
  }

  revalidatePath("/shop");
  redirect("/shop");
};

const logUserLogin = async (
  userId: number,
  loginMethod: LoginMethod,
  deviceType: DeviceType,
) => {
  try {
    const newLogin = await db.userLogin.create({
      data: {
        userId,
        deviceType,
        loginMethod,
      },
    });
    //TODO: remove unnecessary logs after ensuring the guildroom tablet is detected correctly
    console.log("created login", newLogin);
  } catch (error) {
    console.error("An error occurred while logging user login:", error);
  }
};
