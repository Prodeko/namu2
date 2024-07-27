"use server";

import { UserWishObject, WishObject } from "@/common/types";
import { db } from "@/server/db/prisma";
import { Wish, WishLike, WishStatus } from "@prisma/client";

type WishWithLikes = Wish & { WishLike: WishLike[] };

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
  const like = await db.wishLike.findUnique({
    where: {
      wishId_userId: {
        userId: userId,
        wishId: wishId,
      },
    },
  });
  return !!like;
};

export const toggleLike = async (userId: number, wishId: number) => {
  const likedBefore: boolean = await hasLiked(userId, wishId);
  if (likedBefore) {
    await deleteLike(userId, wishId);
  } else {
    await createLike(userId, wishId);
  }
  return getWishById(wishId);
};

const createLike = async (userId: number, wishId: number) => {
  return await db.wishLike.create({
    data: {
      wishId: wishId,
      userId: userId,
    },
  });
};

export const createWish = async (
  title: string,
  description: string,
  webUrl?: string,
) => {
  return await db.wish.create({
    data: {
      title: title,
      description: description,
      webUrl: webUrl,
    },
  });
};

const deleteLike = async (userId: number, wishId: number) => {
  return await db.wishLike.delete({
    where: {
      wishId_userId: {
        userId: userId,
        wishId: wishId,
      },
    },
  });
};

const formatWish = (wish: WishWithLikes): WishObject => {
  return {
    id: wish.id,
    name: wish.title,
    description: wish.description,
    webUrl: wish.webUrl,
    wishDate: wish.createdAt,
    resolutionDate: wish.resolvedAt,
    resolutionMessage: wish.responseMsg,
    status: wish.status,
    voteCount: wish.WishLike.length,
  };
};

const formatUserWish = (
  wish: WishWithLikes,
  userId: number,
): UserWishObject => {
  return {
    ...formatWish(wish),
    userLikesWish: wish.WishLike.some((like) => like.userId === userId),
  };
};

export const getWishes = async (): Promise<WishObject[]> => {
  const wishes = await db.wish.findMany({
    include: {
      WishLike: {
        include: {
          user: true,
        },
      },
    },
  });
  const formattedWishes = wishes.map(formatWish);
  return formattedWishes;
};

export const getWishById = async (wishId: number): Promise<WishObject> => {
  const wish = await db.wish.findUnique({
    where: { id: wishId },
    include: {
      WishLike: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!wish) {
    throw new Error(`Wish with id ${wishId} not found`);
  }
  return formatWish(wish);
};

export const getUserWishes = async (
  userId: number,
): Promise<UserWishObject[]> => {
  const wishes = await db.wish.findMany({
    include: {
      WishLike: {
        include: {
          user: true,
        },
      },
    },
  });
  const formattedWishes = wishes.map((wish) => formatUserWish(wish, userId));
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
