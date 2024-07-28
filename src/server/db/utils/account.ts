"use server";

import { getSession } from "@/auth/ironsession";
import { CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";
import { Role, User } from "@prisma/client";

const createAccount = async ({
  accountCredentials,
  role,
}: {
  accountCredentials: CreateAccountCredentials;
  role: Role;
}) => {
  const { firstName, lastName, userName, pinCode } = accountCredentials;
  const pinHash = await createPincodeHash(pinCode);
  return db.user.create({
    data: {
      firstName,
      lastName,
      userName,
      role,
      pinHash,
    },
  });
};

export const createUserAccount = async (
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ accountCredentials, role: Role.USER });
};

export const createAdminAccount = async (
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ accountCredentials, role: Role.ADMIN });
};

export const createSuperAdminAccount = async (
  accountCredentials: CreateAccountCredentials,
) => {
  return createAccount({ accountCredentials, role: Role.SUPERADMIN });
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
