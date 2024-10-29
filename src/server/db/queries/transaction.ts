import { z } from "zod";

import { ReceiptProduct, Timeframe } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ValueError } from "@/server/exceptions/exception";
import { Prisma, PrismaClient } from "@prisma/client";


const spendingParser = z.object({
  truncatedDate: z.date(),
  totalSpending: z.number(),
});

const arraySpendingParser = z.array(spendingParser);
type Spending = z.infer<typeof spendingParser>;

const favouriteProductParser = z.object({
  name: z.string(),
  imageUrl: z.string(),
  totalQuantity: z
    .number()
    .int({
      message: "totalQuantity must be an integer",
    })
    .nonnegative({ message: "totalQuantity must be a non-negative integer" }),
});
type FavouriteProduct = z.infer<typeof favouriteProductParser>;

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

export const getCumulativeSpending = async (
  userId: number,
  timeFrame: Timeframe,
): Promise<
  | {
      ok: true;
      cumulativeSpending: Spending[];
    }
  | {
      ok: false;
    }
> => {
  try {
    const result = await db.$queryRaw`
    WITH all_timeframe AS (
      SELECT
        generate_series(
            (SELECT date_trunc('${timeFrame}', MIN("createdAt"::date)) FROM transactions),
            current_date,
            '1 ${timeFrame}'::interval
        ) AS week_start
    )
      
    SELECT
      week_start,
      COALESCE(SUM("totalPrice"), 0) AS total_spending
    FROM all_timeframe
    LEFT JOIN transactions
    ON date_trunc('${timeFrame}', "createdAt"::date) = week_start
    WHERE "userId" = ${userId}
    ORDER BY week_start;
  `;
    const parseResult = arraySpendingParser.safeParse(result);

    if (!parseResult.success) {
      throw new ValueError({
        message: "Failed to parse product categories",
        cause: "invalid_value",
      });
    }
    return { ok: true, cumulativeSpending: parseResult.data };
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(
        `An error occurred while executing query to fetch product categories: ${error}`,
      );
    }
    return { ok: false };
  }
};

export const getUserFavouriteProduct = async (
  userId: number,
  timeFrame: Timeframe,
): Promise<
  | {
      ok: true;
      favouriteProduct: FavouriteProduct;
    }
  | { ok: false }
> => {
  try {
    let timeFilter: Prisma.Sql = Prisma.sql`AND TRUE`;
    if (timeFrame !== "allTime") {
      timeFilter = Prisma.sql`AND "Transaction"."createdAt"::date >= date_trunc(${timeFrame}, current_date) `;
    }

    const result = (await db.$queryRaw`
    SELECT "name", "imageUrl", SUM(quantity) as totalQuantity
    FROM "TransactionItem"
    JOIN "Product" ON "productId" = "Product"."id"
    WHERE "transactionId" IN (
      SELECT "id"
      FROM "Transaction"
      WHERE "userId" = ${userId} ${timeFilter}
    )
    GROUP BY "productId", "name", "imageUrl"
    ORDER BY totalQuantity DESC
    LIMIT 1;
  `) as FavouriteProduct[];
    const product = result[0];

    if (product === undefined) {
      throw new ValueError({
        message: "No favourite product found",
        cause: "missing_value",
      });
    }

    const formattedProduct = {
      name: product?.name,
      imageUrl: product?.imageUrl,
      totalQuantity: Number(product?.totalQuantity), // Is bigint before casting
    };

    const parsedProduct = favouriteProductParser.safeParse(formattedProduct);

    if (!parsedProduct.success) {
      throw new ValueError({
        message: "Failed to parse favourite product",
        cause: "invalid_value",
      });
    }
    return { ok: true, favouriteProduct: parsedProduct.data };
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(
        `An error occurred while executing query to fetch favourite product: ${error}`,
      );
    }
    return { ok: false };
  }
};

export const getUserBalance = async (db: PrismaClient, userId: number) => {
  return db.userBalance.findFirst({
    where: {
      userId,
      isActive: true,
    },
  });
};

export const getProductInventory = async (
  db: PrismaClient,
  productId: number,
) => {
  return db.productInventory.findFirst({
    where: {
      productId,
      isActive: true,
    },
  });
};

export const getReceiptItems = async () => {
  const lastTransaction = await db.transaction.findFirst({
    orderBy: {
      createdAt: "desc", // Sort by createdAt in descending order to get the latest transaction
    },
    include: {
      TransactionItem: {
        include: {
          Product: true, // Include the related Product to access the name
        },
      },
    },
  });
  if (!lastTransaction) {
    // Handle the case where there are no transactions
    throw new Error("No transactions found.");
  }

  const receiptProducts: ReceiptProduct[] = lastTransaction.TransactionItem.map(
    (item) => ({
      name: item.Product.name, // Assuming Product has a 'name' field
      quantity: item.quantity,
      singleItemPrice: item.singleItemPrice.toNumber(), // Convert Decimal to number
      totalPrice: item.totalPrice.toNumber(), // Convert Decimal to number
      purchaseDate: lastTransaction.createdAt,
    }),
  );

  return receiptProducts;
};
