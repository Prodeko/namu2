"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { userAgent } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { createSession } from "@/auth/ironsession";
import { LoginFormState, loginFormParser } from "@/common/types";
import { RFID_ALLOWED_DEVICE_TYPE } from "@/common/utils";
import { db } from "@/server/db/prisma";
import {
  getUserByRfidTag,
  getUserByUsername,
} from "@/server/db/queries/account";
import { createRfidTagHash, verifyPincode } from "@/server/db/utils/auth";
import { ValueError } from "@/server/exceptions/exception";
import { DeviceType, LoginMethod } from "@prisma/client";

const limiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export const loginAction = async (
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {
  const pinCode = formData.get("pinCode") as string | undefined;
  const userName = formData.get("userName") as string | undefined;
  const deviceType = formData.get("deviceType") as string | undefined;
  const input = loginFormParser.safeParse({
    userName,
    pinCode,
    deviceType,
  });

  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || "anonymous";
  console.log("clientIp", clientIp);
  if (clientIp == "anonymous") {
    console.log("couldn't figure out ip for rate limiting");
  }

  try {
    await limiter.consume(clientIp).catch(() => {
      throw new ValueError({
        cause: "invalid_value",
        message: "Too many requests, try again later",
      });
    });
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

    if (!deviceType) {
      throw new ValueError({
        cause: "missing_value",
        message: "Error logging in, please try again",
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
      input.data.pinCode = "";
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
    logUserLogin(user.id, "PASSOWRD", data.deviceType);
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
    return {
      userName: input.success ? input.data.userName : "",
      pinCode: input.success ? input.data.pinCode : "",
      deviceType: input.success ? input.data.deviceType : "MOBILE",
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
<<<<<<< HEAD
    const requestHeaders = await headers();
    const { device } = userAgent({
      headers: requestHeaders,
    });
    const deviceModel = device.model || "";
    const isGuildroomTablet =
      deviceModel.includes("Armor") &&
      deviceModel.includes("Pad") &&
      deviceModel.includes("Pro");
    console.log("isGuildroomTablet", isGuildroomTablet, device);
    const isMobile =
      requestHeaders.get("Sec-CH-UA-Mobile")?.includes("1") ||
      device.type === "mobile" ||
      false;

    const deviceType: DeviceType = isGuildroomTablet
      ? "GUILDROOM_TABLET"
      : isMobile
        ? "MOBILE"
        : "DESKTOP";

=======
>>>>>>> main
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
