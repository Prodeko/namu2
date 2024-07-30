import { z } from "zod";

import { Timeframe } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ValueError } from "@/server/exceptions/exception";

const spendingParser = z.object({
  truncatedDate: z.date(),
  totalSpending: z.number(),
});

const arraySpendingParser = z.array(spendingParser);
type Spending = z.infer<typeof spendingParser>;

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
