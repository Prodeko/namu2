import { db } from "@/server/db/prisma";
import { Wish } from "@prisma/client";

export const getLikeCountById = async (wishId: number): Promise<number> => {
  const likes = await db.wishLike.count({
    where: {
      wishId: wishId,
    },
  });
  return likes;
};

export const hasLiked = async (
  userId: number,
  wishId: number,
): Promise<boolean> => {
  const like = await db.wishLike.findFirst({
    where: {
      wishId: wishId,
      userId: userId,
    },
  });
  return !!like;
};

export const toggleLike = async (userId: number, wishId: number) => {
  const likedBefore: boolean = await hasLiked(userId, wishId);
  if (likedBefore) await deleteLike(userId, wishId);
  else await createLike(userId, wishId);
  return likedBefore;
};

const createLike = async (userId: number, wishId: number) => {
  const like = await db.wishLike.create({
    data: {
      wishId: wishId,
      userId: userId,
    },
  });
};

const deleteLike = async (userId: number, wishId: number) => {
  await db.wishLike.deleteMany({
    where: {
      wishId: wishId,
      userId: userId,
    },
  });
};

export const getWishes = async (): Promise<Wish[]> => {
  const wishes = await db.wish.findMany();
  return wishes;
};
