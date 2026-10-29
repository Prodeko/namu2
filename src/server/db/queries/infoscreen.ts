import { z } from "zod";

import { db } from "@/server/db/prisma";

// Aggregates for the guild room infoscreen (github.com/Prodeko/infoscreen).
// Nothing here identifies a user: only product totals and wish like counts.

const topProductParser = z.object({
  id: z.number().int(),
  name: z.string(),
  imageUrl: z.string(),
  quantity: z.number().int().nonnegative(),
});

export type InfoscreenTopProduct = z.infer<typeof topProductParser>;

export type InfoscreenWish = {
  id: number;
  title: string;
  likes: number;
};

// Most bought products since Monday, by quantity. The week starts the same
// way as in the stats pages (date_trunc on current_date).
export const getTopProductsThisWeek = async (
  limit: number,
): Promise<InfoscreenTopProduct[]> => {
  const rows = await db.$queryRaw`
    SELECT "Product"."id", "Product"."name", "Product"."imageUrl",
      SUM("TransactionItem"."quantity")::int AS "quantity"
    FROM "TransactionItem"
    JOIN "Transaction" ON "Transaction"."id" = "TransactionItem"."transactionId"
    JOIN "Product" ON "Product"."id" = "TransactionItem"."productId"
    WHERE "Transaction"."createdAt"::date >= date_trunc('week', current_date)
    GROUP BY "Product"."id", "Product"."name", "Product"."imageUrl"
    ORDER BY "quantity" DESC
    LIMIT ${limit};
  `;
  return z.array(topProductParser).parse(rows);
};

// Open wishes with the most likes
export const getTopOpenWishes = async (
  limit: number,
): Promise<InfoscreenWish[]> => {
  const wishes = await db.wish.findMany({
    where: { status: "OPEN" },
    select: {
      id: true,
      title: true,
      _count: { select: { WishLike: true } },
    },
    orderBy: { WishLike: { _count: "desc" } },
    take: limit,
  });
  return wishes.map((wish) => ({
    id: wish.id,
    title: wish.title,
    likes: wish._count.WishLike,
  }));
};
