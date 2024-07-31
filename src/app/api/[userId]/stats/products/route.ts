import type { NextRequest } from "next/server";

import { getSession } from "@/auth/ironsession";
import { Timeframe } from "@/common/types";
import { getCumulativeSpending } from "@/server/db/queries/transaction";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = session.user.userId;

  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame") as Timeframe | null;

  if (!timeFrame) {
    return new Response("Bad Request", { status: 400 });
  }

  const cumulativeSpending = await getCumulativeSpending(userId, timeFrame);

  if (!cumulativeSpending.ok) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({ data: cumulativeSpending });
}
