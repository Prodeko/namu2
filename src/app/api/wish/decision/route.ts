import { getSession } from "@/auth/ironsession";
import { editWish } from "@/server/db/queries/wish";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { wishId, decision, message } = await req.json();
  const updatedWish = await editWish(wishId, decision, message);

  return Response.json({ data: { status: updatedWish.status } });
}
