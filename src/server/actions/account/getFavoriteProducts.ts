"use Server";

import { ClientProduct } from "@/common/types";
import { db } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/db/queries/account";
import { getActiveClientProducts } from "@/server/db/queries/product";

export const getFavoriteProducts = async (): Promise<ClientProduct[]> => {
  const user = await getCurrentUser();
  if (!user.ok) return [];
  const userId = user.user.id;

  const topProductIds = (await db.$queryRaw`
    SELECT 
    ti."productId"
    FROM "Transaction" t
    JOIN "TransactionItem" ti ON t."id" = ti."transactionId"
    WHERE t."userId" = ${userId}
    GROUP BY ti."productId"
    ORDER BY SUM(ti."quantity") DESC
    LIMIT 3;
    `) as { productId: number }[];

  const productIdList = topProductIds.map((row) => row.productId);

  const clientProducts = await getActiveClientProducts();
  const topProducts = clientProducts.filter((product) =>
    productIdList.includes(product.id),
  );

  return topProducts;
};
