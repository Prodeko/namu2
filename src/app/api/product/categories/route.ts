import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = (await db.$queryRaw`
    WITH products AS (
      SELECT "category", "name"
      FROM "Product"
      ORDER BY "category", "name"
    )

    SELECT "category", ARRAY_AGG("name") as products
    FROM products
    GROUP BY 1
    LIMIT 1;
  `) as any[];

  const parsedResult = result.map((row) => ({
    category: row.category,
    products: row.products,
  }));

  return Response.json({
    data: parsedResult,
  });
}
