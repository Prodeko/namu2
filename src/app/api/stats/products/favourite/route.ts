import { getSession } from "@/auth/ironsession";
import { Timeframe } from "@/common/types";
import { getUserFavouriteProduct } from "@/server/db/queries/transaction";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame") as Timeframe | undefined;

  if (!timeFrame) {
    return new Response("Bad Request", { status: 400 });
  }

  const favouriteProduct = await getUserFavouriteProduct(
    session.user.userId,
    timeFrame,
  );

  if (!favouriteProduct.ok) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({
    data: favouriteProduct,
  });
}
