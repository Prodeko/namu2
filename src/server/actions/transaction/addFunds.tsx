"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";
import { newDeposit } from "@/server/db/queries/deposit";
import { InvalidSessionError, ValueError } from "@/server/exceptions/exception";
import { DepositMethod, PrismaClient } from "@prisma/client";

export const addFundsAction = async (
  amount: number,
  depositMethod: DepositMethod,
) => {
  try {
    if (amount <= 0) {
      throw new ValueError({
        message: "Amount must be greater than 0",
        cause: "invalid_value",
      });
    }
    const session = await getSession();
    if (!session) {
      throw new InvalidSessionError({
        message: "Session is invalid",
        cause: "missing_session",
      });
    }
    if (!session.user) {
      throw new InvalidSessionError({
        message: "User role is missing",
        cause: "missing_role",
      });
    }
    const userId = session.user.userId;

    await db.$transaction(async (tx) => {
      try {
        await newDeposit(tx as PrismaClient, userId, amount, depositMethod);
      } catch (error: any) {
        throw error?.message || "Unknown error when adding funds";
      }
    });
    revalidatePath("/shop");
  } catch (error: any) {
    const message = error?.message || "Unknown error when adding funds";
    return { error: message };
  }
};

export const adminAddFundsAction = async (amount: number, userId: number) => {
  try {
    await db.$transaction(async (tx) => {
      try {
        await newDeposit(
          tx as PrismaClient,
          userId,
          amount,
          DepositMethod.ADMIN,
        );
      } catch (error: any) {
        throw error?.message || "Unknown error when adding funds";
      }
    });
  } catch (error: any) {
    const message = error?.message || "Unknown error when adding funds";
    return { error: message };
  }
};
