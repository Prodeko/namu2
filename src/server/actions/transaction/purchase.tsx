"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession } from "@/auth/ironsession";
import { CartProduct } from "@/common/types";
import { db } from "@/server/db/prisma";
import { getUserBalance } from "@/server/db/queries/transaction";
import {
  AccountBalanceError,
  InvalidSessionError,
  InventoryError,
} from "@/server/exceptions/exception";
import { Prisma, PrismaClient, TransactionItem } from "@prisma/client";

export const purchaseAction = async (shoppingCart: CartProduct[]) => {
  const session = await getSession();
  if (!session) {
    throw new InvalidSessionError({
      message: "Session is invalid",
      cause: "missing_session",
    });
  }
  if (!session.user) {
    throw new InvalidSessionError({
      message: "Session user is missing",
      cause: "missing_role",
    });
  }
  const userId = session.user.userId;

  await db.$transaction(async (tx) => {
    try {
      await makePurchase(tx as PrismaClient, userId, shoppingCart);
    } catch (error: any) {
      throw error?.message || "Unknown error";
    }
  });

  revalidatePath("/shop");
  redirect("/shop");
};

const makePurchase = async (
  tx: PrismaClient,
  userId: number,
  shoppingCart: CartProduct[],
) => {
  const userBalance = await getUserBalance(tx, userId);
  console.log("got user balance", userBalance);
  if (userBalance == null) {
    throw new AccountBalanceError({
      cause: "balance_lookup_error",
      message: "User balance not found",
    });
  }

  const orderTotal = getOrderTotal(shoppingCart);
  const newBalance = userBalance.balance.toNumber() - orderTotal;
  if (newBalance < 0) {
    throw new AccountBalanceError({
      cause: "insufficient_balance",
      message: "User balance not enough",
    });
  }

  // Create transaction
  const newTransaction = await tx.transaction.create({
    data: {
      userId,
      totalPrice: orderTotal,
    },
  });
  const transactionItems: TransactionItem[] = [];

  // Update product inventory
  for (const item of shoppingCart) {
    const productInventory = await tx.productInventory.findFirst({
      where: {
        productId: item.id,
        isActive: true,
      },
    });
    if (productInventory == null) {
      throw new InventoryError({
        cause: "product_not_found",
        message: "Product inventory not found",
      });
    }
    console.log(
      `Inventory for ${productInventory.productId}: ${productInventory.quantity}`,
    );
    const newQuantity = productInventory.quantity - item.quantity;

    if (newQuantity < 0) {
      throw new InventoryError({
        cause: "out_of_stock",
        message: `${item.name} is out of stock`,
      });
    }
    await tx.productInventory.update({
      where: {
        productId_validStart: {
          productId: productInventory.productId,
          validStart: productInventory.validStart,
        },
      },
      data: {
        validEnd: new Date(),
        isActive: false,
      },
    });

    await tx.productInventory.create({
      data: {
        productId: productInventory.productId,
        quantity: newQuantity,
      },
    });
    console.log(`Updated and created for ${item.name}`);
    transactionItems.push({
      transactionId: newTransaction.id,
      productId: item.id,
      quantity: item.quantity,
      singleItemPrice: new Prisma.Decimal(item.price),
      totalPrice: new Prisma.Decimal(item.price * item.quantity),
    });
    console.log(`Added new thimg to transaction items ${item.name}`);
  }
  console.log("done with products, now creating transaction items");
  await tx.transactionItem.createMany({
    data: transactionItems,
  });

  // All transaction parts ok
  // Update user balance
  await tx.userBalance.update({
    where: {
      userId_validStart: {
        userId: userBalance.userId,
        validStart: userBalance.validStart,
      },
    },
    data: {
      validEnd: new Date(),
      isActive: false,
    },
  });

  const newUserBalance = await tx.userBalance.create({
    data: {
      userId: userBalance.userId,
      balance: new Prisma.Decimal(newBalance),
    },
  });

  return newUserBalance;
};

const getOrderTotal = (shoppingCart: CartProduct[]) => {
  let totalPrice = 0.0;
  for (const item of shoppingCart) {
    totalPrice += item.price * item.quantity;
  }
  return totalPrice;
};
