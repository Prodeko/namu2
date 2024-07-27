import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { wishId } = await req.json();

  const currentLike = await db.wishLike.findFirst({
    where: {
      userId: session.user.userId,
      wishId: wishId,
    },
  });

  if (currentLike) {
    await db.wishLike.delete({
      where: {
        id: currentLike.id,
      },
    });
    return new Response("Like deleted successfully", { status: 200 });
  }
  await db.wishLike.create({
    data: {
      userId: session.user.userId,
      wishId: wishId,
    },
  });
  return new Response("Like created successfully", { status: 200 });
}
