"use server";

import { getSession } from "@/auth/ironsession";
import type { CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import type { GenericClient } from "@/server/db/utils/dbTypes";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";
import type { Role, User } from "@prisma/client";

export const createAccount = async ({
  client,
  accountCredentials,
  role,
}: {
  client: GenericClient;
  accountCredentials: CreateAccountCredentials;
  role: Role;
}) => {
  const { firstName, lastName, userName, pinCode } = accountCredentials;
  const pinHash = await createPincodeHash(pinCode);
  return client.user.create({
    data: {
      firstName,
      lastName,
      userName,
      role,
      pinHash,
    },
  });
};

export const updatePincode = async (newPincode: string, userId: number) => {
  const pinHash = await createPincodeHash(newPincode);
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      pinHash,
    },
  });
};

export const getCurrentUser = async (): Promise<
  { ok: true; user: User } | { ok: false }
> => {
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
        message: "Session user is missing",
        cause: "missing_role",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.userId,
      },
    });

    if (!user) {
      throw new ValueError({
        message: `User with id ${session.user.userId} was not found`,
        cause: "missing_value",
      });
    }
    return { ok: true, user };
  } catch (error) {
    if (error instanceof ValueError || error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else {
      console.error(`Failed to get current user: ${error}`);
    }
    return { ok: false };
  }
};
