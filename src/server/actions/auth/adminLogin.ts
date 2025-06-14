"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { createSession } from "@/auth/ironsession";
import { type LoginFormState, loginFormParser } from "@/common/types";
import { getUserByUsername } from "@/server/db/queries/account";
import { verifyPincode } from "@/server/db/utils/auth";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";
import { DeviceType } from "@prisma/client";

const limiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export const adminLoginAction = async (
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

    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      console.debug(`Request unauthorized: user ${user.id} is not an admin`);
      throw new InvalidSessionError({
        cause: "invalid_role",
        message: "The user is not an admin",
      });
    }

    await createSession(user);
  } catch (error) {
    if (error instanceof ValueError || error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(error);
    }
    return {
      userName: input.success ? input.data.userName : "",
      pinCode: input.success ? input.data.pinCode : "",
      deviceType: input.success ? input.data.deviceType : DeviceType.MOBILE,
      message:
        error instanceof Error ? error.message : "Invalid username or PIN code",
    };
  }
  revalidatePath("/admin/edit-products");
  redirect("/admin/edit-products");
};
