"use server";

import { ClientLegacyUser } from "@/common/types";
import { db } from "@/server/db/prisma";

export const getUnmigratedAccounts = async (): Promise<ClientLegacyUser[]> => {
  const users = await db.legacyUser.findMany({
    where: {
      alreadyMigrated: false,
    },
  });
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    balance: user.balance.toNumber(),
  }));
};
