"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";
import { newDeposit } from "@/server/db/queries/deposit";
import { InvalidSessionError } from "@/server/exceptions/exception";
import { PrismaClient } from "@prisma/client";

export const addFundsAction = async (amount: number) => {
  const session = await getSession();
  if (!session) {
    throw new InvalidSessionError({
      message: "Session is invalid",
      cause: "missing_session",
    });
  }
  if (!session.user) {
    throw new InvalidSessionError({
      message: "Session user is missing",
      cause: "missing_role",
    });
  }
  const userId = session.user.userId;

  await db.$transaction(async (tx) => {
    try {
      await newDeposit(tx as PrismaClient, userId, amount);
    } catch (error: any) {
      throw error?.message || "Unknown error when adding funds";
    }
  });

  revalidatePath("/shop");
  redirect("/shop");
};
