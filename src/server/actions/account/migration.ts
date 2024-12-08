"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/auth/ironsession";
import { ClientLegacyUser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { newDeposit } from "@/server/db/queries/deposit";
import { ValueError } from "@/server/exceptions/exception";
import { Prisma, PrismaClient } from "@prisma/client";

export const getUnmigratedAccounts = async (): Promise<ClientLegacyUser[]> => {
  const users = await db.legacyUser.findMany({
    where: {
      newAccountId: null,
    },
  });
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    balance: user.balance.toNumber(),
  }));
};

export const migrateAccountAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getSession();
    const currentUserId = session?.user?.userId;
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }
    const formUserId = formData.get("legacyAccountId") as string;
    const legacyId = parseInt(formUserId);
    if (!legacyId) {
      throw new ValueError({
        cause: "invalid_value",
        message: "Couldn't find legacy user to migrate",
      });
    }

    await db.$transaction(async (tx) => {
      const legacyUser = await tx.legacyUser.update({
        where: {
          id: legacyId,
        },
        data: {
          newAccountId: currentUserId,
        },
      });
      if (!legacyUser) {
        throw new ValueError({
          cause: "invalid_value",
          message: "Couldn't find legacy user to migrate",
        });
      }
      const legacyBalance = legacyUser.balance.toNumber();
      await newDeposit(
        tx as PrismaClient,
        currentUserId,
        legacyBalance,
        "ACCOUNT_MIGRATION",
      );
    });
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error: "You've already migrated a legacy account!",
        };
      }
    }
    return { error: error?.message || "Unknown error occurred" };
  }
};
