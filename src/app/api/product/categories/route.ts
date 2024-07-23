import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = (await db.$queryRaw`
    WITH products AS (
      SELECT "category" as categoryName, "name" as nodeName, "id" as nodeId
      FROM "Product"
      ORDER BY "category", "name"
    )

    SELECT categoryName, JSON_AGG(JSON_BUILD_OBJECT('nodeName', nodeName, 'nodeId', nodeId)) as nodes
    FROM products
    GROUP BY 1
    LIMIT 1;
  `) as any[];

  const parsedResult = result.map((row) => ({
    categoryName: row.categoryname,
    nodes: row.nodes,
  }));

  return Response.json({
    data: parsedResult,
  });
}
