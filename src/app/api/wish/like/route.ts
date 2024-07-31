import { getSession } from "@/auth/ironsession";
import { toggleLike } from "@/server/db/queries/wish";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { wishId } = await req.json();

  if (!wishId) {
    return new Response("Bad Request", { status: 400 });
  }

  const toggledLike = await toggleLike(session.user.userId, wishId);

  if (!toggledLike.ok) {
    return new Response("Internal Server Error", { status: 500 });
  }
  return new Response(`Like ${toggledLike.operation} successfully`, {
    status: 200,
  });
}
