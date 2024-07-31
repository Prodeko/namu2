import { getSession } from "@/auth/ironsession";
import { getProductsGroupedByCategory } from "@/server/db/queries/product";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await getProductsGroupedByCategory();

  if (!result.ok) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({
    data: result.categories,
  });
}
