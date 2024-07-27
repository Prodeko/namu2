import { getSession } from "@/auth/ironsession";
import { Timeframe } from "@/common/types";
import { db } from "@/server/db/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame") as Timeframe;
  let timeFilter: Prisma.Sql = Prisma.sql`AND TRUE`;
  if (timeFrame !== "allTime") {
    timeFilter = Prisma.sql`AND "Transaction"."createdAt"::date >= date_trunc(${timeFrame}, current_date) `;
  }

  const result = (await db.$queryRaw`
    SELECT COUNT(*)
    FROM "Transaction"
    WHERE "userId" = ${session.user.userId} ${timeFilter};
  `) as any[];

  return Response.json({ data: Number(result[0].count) });
}
