import { timingSafeEqual } from "node:crypto";

import { serverEnv } from "@/env/server.mjs";
import {
  getTopOpenWishes,
  getTopProductsThisWeek,
} from "@/server/db/queries/infoscreen";

// Read-only aggregates for the guild room infoscreen: this week's most bought
// products and the most liked open wishes. The infoscreen's server sends the
// shared key in the x-infoscreen-key header. Without INFOSCREEN_API_KEY set,
// the endpoint doesn't exist.

export const dynamic = "force-dynamic";

const TOP_COUNT = 5;

const keyMatches = (given: string | null, expected: string) => {
  if (!given) {
    return false;
  }
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function GET(request: Request) {
  const expected = serverEnv.INFOSCREEN_API_KEY;
  if (!expected) {
    return new Response("Not Found", { status: 404 });
  }
  if (!keyMatches(request.headers.get("x-infoscreen-key"), expected)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [topProducts, topWishes] = await Promise.all([
      getTopProductsThisWeek(TOP_COUNT),
      getTopOpenWishes(TOP_COUNT),
    ]);
    return Response.json(
      { topProducts, topWishes },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Infoscreen stats failed", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
