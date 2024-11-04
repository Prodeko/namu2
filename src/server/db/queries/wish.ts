"use server";

import { revalidatePath } from "next/cache";

import { UserWishObject, WishObject } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ValueError } from "@/server/exceptions/exception";
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

export const userLikesWish = async (
  userId: number,
  wishId: number,
): Promise<WishLike | null> => {
  const like = await db.wishLike.findUnique({
    where: {
      wishId_userId: {
        userId: userId,
        wishId: wishId,
      },
    },
  });
  return like;
};

export const toggleLike = async (
  userId: number,
  wishId: number,
): Promise<
  | {
      ok: true;
      operation: "created" | "deleted";
    }
  | {
      ok: false;
    }
> => {
  try {
    const likedBefore = await userLikesWish(userId, wishId);
    if (likedBefore) {
      await deleteLike(userId, wishId);
      return {
        ok: true,
        operation: "deleted",
      };
    }
    await createLike(userId, wishId);
    return {
      ok: true,
      operation: "created",
    };
  } catch (e) {
    if (e instanceof ValueError) {
      console.error(e.toString());
    } else {
      console.error(`Failed to toggle like: ${e}`);
    }
    return { ok: false };
  }
};

const createLike = async (userId: number, wishId: number) => {
  return await db.wishLike.create({
    data: {
      wishId: wishId,
      userId: userId,
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

export const getWishById = async (
  wishId: number,
): Promise<
  | {
      ok: true;
      wish: WishObject;
    }
  | { ok: false }
> => {
  try {
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
      throw new ValueError({
        cause: "missing_value",
        message: `Wish with id ${wishId} not found`,
      });
    }
    return {
      ok: true,
      wish: formatWish(wish),
    };
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(`Failed to get wish: ${error}`);
    }
    return { ok: false };
  }
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
  const wish = await db.wish.update({
    where: {
      id: wishId,
    },
    data: {
      status: newStatus,
      responseMsg,
      resolvedAt: new Date(),
    },
  });
  revalidatePath("/admin/wishes");
  return wish;
};
