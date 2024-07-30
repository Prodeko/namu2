import { db } from "@/server/db/prisma";

export const getUserTransactionsWithItems = async (userId: number) => {
  return db.transaction.findMany({
    where: {
      userId: userId,
    },
    include: {
      TransactionItem: { include: { Product: true } },
    },
  });
};
