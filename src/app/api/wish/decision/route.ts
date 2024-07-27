import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { wishId, decision, message } = await req.json();

  const data = {
    status: decision,
    responseMsg: message,
    resolvedAt: new Date(),
  };

  await db.wish.update({
    where: {
      id: wishId,
    },
    data,
  });

  return Response.json({ data });
}
