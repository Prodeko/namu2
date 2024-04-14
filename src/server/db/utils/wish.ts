"use server";

import { WishObject } from "@/common/types";
import { db } from "@/server/db/prisma";
import { User, Wish, WishStatus } from "@prisma/client";

import { getCurrentUser } from "./account";

let user: User | null = null;

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

const formatWish = async (wish: Wish): Promise<WishObject> => {
  const voteCount = await getLikeCountById(wish.id);
  if (!user) user = await getCurrentUser();
  const userHasLiked = await hasLiked(user.id, wish.id);
  return {
    id: wish.id,
    name: wish.title,
    wishDate: wish.createdAt,
    resolutionDate: wish.resolvedAt,
    resolutionMessage: wish.responseMsg,
    status: wish.status,
    voteCount,
    hasLiked: userHasLiked,
  } as WishObject;
};
export const getWishes = async (): Promise<WishObject[]> => {
  const wishes = await db.wish.findMany();
  const formattedWishes = await Promise.all(
    wishes.map((wish) => formatWish(wish)),
  );
  return formattedWishes;
};

export const editWish = async (
  wishId: number,
  newStatus: WishStatus,
  responseMsg = "",
) => {
  await db.wish.update({
    where: {
      id: wishId,
    },
    data: {
      status: newStatus as Wish["status"],
      responseMsg,
      resolvedAt: new Date(),
    },
  });
};
