"use server";

import { requireAdminSession } from "@/server/auth/requireAdmin";
import { db } from "@/server/db/prisma";
import { getUserBalance } from "@/server/db/queries/transaction";

/**
 * Read another user's current balance. Admin only — regular users read their
 * own balance through `getCurrentUserBalance`.
 *
 * A user who has never had money moved has no balance row at all; that reads
 * as 0, the same as `getCurrentBalance` does.
 */
export const getUserBalanceAction = async (
  userId: number,
): Promise<{ ok: true; balance: number } | { ok: false; error: string }> => {
  try {
    await requireAdminSession();
    const userBalance = await getUserBalance(db, userId);
    return { ok: true, balance: userBalance?.balance.toNumber() ?? 0 };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error when reading balance",
    };
  }
};
