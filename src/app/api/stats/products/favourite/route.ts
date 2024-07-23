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

  const productQuery = (await db.$queryRaw`
    SELECT "name", "imageUrl", SUM(quantity) as totalQuantity
    FROM "TransactionItem"
    JOIN "Product" ON "productId" = "Product"."id"
    WHERE "transactionId" IN (
      SELECT "id"
      FROM "Transaction"
      WHERE "userId" = ${session.user.userId} ${timeFilter}
    )
    GROUP BY "productId", "name", "imageUrl"
    ORDER BY totalQuantity DESC
    LIMIT 1;
  `) as any[];
  const product = productQuery[0];
  const parsedProduct = {
    name: product?.name,
    imageUrl: product?.imageUrl,
    totalQuantity: Number(product?.totalquantity), // Is bigint before casting
  };
  return Response.json({
    data: parsedProduct,
  });
}
