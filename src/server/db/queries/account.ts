"use server";

import { getSession } from "@/auth/ironsession";
import type { ClientUser, CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import type { GenericClient } from "@/server/db/utils/dbTypes";
import {
  InternalServerError,
  InvalidSessionError,
  ValueError,
} from "@/server/exceptions/exception";
import {
  Prisma,
  type PrismaClient,
  type Role,
  type User,
} from "@prisma/client";

import { getUserBalance } from "./transaction";

export const createAccount = async ({
  client,
  accountCredentials,
  role,
}: {
  client: GenericClient;
  accountCredentials: CreateAccountCredentials;
  role: Role;
}) => {
  const { firstName, lastName, userName, pinCode, legacyAccountId } =
    accountCredentials;
  const pinHash = await createPincodeHash(pinCode);

  const newUser = await client.user.create({
    data: {
      firstName,
      lastName,
      userName,
      role,
      pinHash,
    },
  });

  let balance = 0;

  if (legacyAccountId) {
    const legacyUser = await getLegacyUserById(
      client as PrismaClient,
      legacyAccountId,
    );
    if (legacyUser) {
      balance = legacyUser.balance.toNumber();
      await migrateLegacyUser(
        client as PrismaClient,
        legacyAccountId,
        newUser.id,
      );
    } else {
      throw new ValueError({
        message: `Legacy user with id ${legacyAccountId} was not found`,
        cause: "missing_value",
      });
    }
  }

  await client.userBalance.create({
    data: {
      userId: newUser.id,
      balance,
    },
  });
  return newUser;
};

export const getAllUsers = async (): Promise<ClientUser[]> => {
  return db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      userName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
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

export const setNfcSerialHash = async (
  nfcSerialHash: string,
  userId: number,
) => {
  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        nfcSerialHash,
      },
    });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ValueError({
          message: "NFC tag is already in use, please use another one.",
          cause: "duplicate_value",
        });
      }
    }
    throw new InternalServerError({
      message: "Internal server error, please try again.",
    });
  }
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

    const user = await getUserById(session.user.userId);

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

export const getUserByUsername = async (userName: string) => {
  return db.user.findUnique({
    where: {
      userName: userName,
    },
  });
};

export const getUserByRfidTag = async (nfcSerialHash: string) => {
  return db.user.findFirst({
    where: {
      nfcSerialHash: nfcSerialHash,
    },
  });
};

export const getUserById = async (userId: number) => {
  return db.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const getCurrentBalance = async () => {
  const user = await getCurrentUser();
  if (!user.ok) return 0;
  const userBalance = await getUserBalance(db, user.user.id);
  if (!userBalance) return 0;
  return userBalance.balance.toNumber();
};

export const getLegacyUserById = async (db: PrismaClient, legacyId: number) => {
  return db.legacyUser.findUnique({
    where: {
      id: legacyId,
    },
  });
};

export const migrateLegacyUser = async (
  db: PrismaClient,
  legacyId: number,
  newUserId: number,
) => {
  await db.legacyUser.update({
    where: {
      id: legacyId,
    },
    data: {
      newAccountId: newUserId,
    },
  });
};

export const getCurrentUserMigrationStatus = async () => {
  const user = await getCurrentUser();
  if (!user.ok) return false;
  const legacyUser = await db.legacyUser.findFirst({
    where: {
      newAccountId: user.user.id,
    },
  });
  return !!legacyUser;
};
