import { z } from "zod";

import { IdParser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ValueError } from "@/server/exceptions/exception";

const groupedDepositParser = z.object({
  eventDate: z.date(),
  items: z.array(
    z.object({
      id: IdParser,
      amount: z.number(),
      createdAtIsoString: z
        .string()
        .datetime({ message: "createdAtIsoString must be a valid isoString" }),
    }),
  ),
});
const groupedDepositHistoryParser = z.array(groupedDepositParser);
type GroupedDeposit = z.infer<typeof groupedDepositParser>;

export const getDepositHistory = async (
  userId: number,
): Promise<
  | {
      ok: true;
      depositHistory: GroupedDeposit[];
    }
  | {
      ok: false;
    }
> => {
  try {
    const depositHistory = await db.$queryRaw`
    SELECT 
      "Deposit"."createdAt"::date as "eventDate", 
      JSON_AGG(JSON_BUILD_OBJECT('id', "id", 'amount', "amount", 'createdAtIsoString', TO_CHAR("createdAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))) as items
    FROM "Deposit"
    WHERE "userId" = ${userId}
    GROUP BY 1
    `;

    const result = groupedDepositHistoryParser.safeParse(depositHistory);
    if (!result.success) {
      console.error(JSON.stringify(result.error, null, 2));
      throw new ValueError({
        message: "Failed to parse deposit history",
        cause: "invalid_value",
      });
    }
    return { ok: true, depositHistory: result.data };
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(
        `An error occurred while executing query to fetch deposit history: ${error}`,
      );
    }
    return { ok: false };
  }
};
