"use server";

import { getSession } from "@/auth/ironsession";
import type { CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import type { GenericClient } from "@/server/db/utils/dbTypes";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";
import type { PrismaClient, Role, User } from "@prisma/client";

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

  let balance = 0;

  if (legacyAccountId) {
    const legacyUser = await getLegacyUserById(
      client as PrismaClient,
      legacyAccountId,
    );
    if (legacyUser) {
      balance = legacyUser.balance.toNumber();
      await migrateLegacyUser(client as PrismaClient, legacyAccountId);
    } else {
      throw new ValueError({
        message: `Legacy user with id ${legacyAccountId} was not found`,
        cause: "missing_value",
      });
    }
  }

  return client.user.create({
    data: {
      firstName,
      lastName,
      userName,
      role,
      pinHash,
      Balances: {
        create: {
          balance,
        },
      },
    },
  });
};

export const getAllUsers = async () => {
  return db.user.findMany();
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
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      nfcSerialHash,
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

export const migrateLegacyUser = async (db: PrismaClient, legacyId: number) => {
  await db.legacyUser.update({
    where: {
      id: legacyId,
    },
    data: {
      alreadyMigrated: true,
    },
  });
};
