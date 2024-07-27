import type { NextRequest } from "next/server";

import { Timeframe } from "@/common/types";
import { db } from "@/server/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: number; timeFrame: Timeframe } },
) {
  const { userId, timeFrame } = params;
  const cumulativeSpending = (await db.$queryRaw`
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
  `) as { week_start: Date; total_spending: number }[];

  return Response.json({ data: cumulativeSpending });
}
