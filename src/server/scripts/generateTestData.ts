import _ from "lodash";

import type { CreateAccountCredentials } from "@/common/types";
import { db } from "@/server/db/prisma";
import {
  createAdminAccount,
  createUserAccount,
} from "@/server/db/utils/account";
import { ValueError } from "@/server/exceptions/exception";
import { LegacyUser, Prisma, ProductCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { createProduct } from "../db/queries/product";

/**
 * Resets the database by deleting all users and products, and resetting the auto-incrementing IDs.
 */
async function resetDatabase() {
  // Delete entries in reverse order of dependency
  await db.transactionItem.deleteMany({});
  await db.restockItem.deleteMany({});
  await db.wishLike.deleteMany({});
  await db.wish.deleteMany({});
  await db.deposit.deleteMany({});
  await db.transaction.deleteMany({});
  await db.restock.deleteMany({});
  await db.productPrice.deleteMany({});
  await db.productInventory.deleteMany({});
  await db.userBalance.deleteMany({});
  await db.user.deleteMany({});
  await db.product.deleteMany({});

  // Reset the sequences for tables with autoincrement IDs
  await db.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Wish_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "WishLike_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Transaction_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Deposit_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Restock_id_seq" RESTART WITH 1`;
}

const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomMoney = (max: number): number => {
  return parseFloat((Math.random() * max).toFixed(2));
};

const prettyPrint = (obj: object) => {
  return JSON.stringify(obj, null, 2);
};

async function generateTestData() {
  await resetDatabase();

  // Create 25 users, with one being an admin
  const firstNames = ["John", "Jane", "Bob", "Alice", "Eve"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];
  const nationalities = ["English", "French", "German", "Italian", "Spanish"];
  const foodNames = ["Hamburger", "Pizza", "Taco", "Sushi", "Pasta"];

  const maxDepositsPerUser = 10;
  const maxDepositAmount = 100;
  const maxProductPrice = 10;
  const maxRestockItems = 50;
  const maxSingleRestockItemQuantity = 20;
  const maxTransactions = 20;
  const maxItemsPerTransaction = 10;
  const maxSingleTransactionItemQuantity = 5;
  const maxLikesPerUser = nationalities.length * foodNames.length;
  const nofProducts = 50;
  const nofRestocks = 200;

  let adminIdx = 1;
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      try {
        const accountCredentials: CreateAccountCredentials = {
          firstName,
          lastName,
          userName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
          pinCode: "1234",
        };
        const user =
          adminIdx === 1
            ? await createAdminAccount(db, accountCredentials)
            : await createUserAccount(db, accountCredentials);
        console.info(`Created user ${adminIdx}: ${prettyPrint(user)}`);
        adminIdx++;
      } catch (e) {
        console.error(`Error creating user ${adminIdx}: ${e}`);
      }
    }
  }

  let legacyId = 1;
  for (const firstName of firstNames) {
    try {
      const legacyAccountInfo: LegacyUser = {
        id: legacyId,
        name: firstName,
        balance: new Prisma.Decimal(randomMoney(100)),
        alreadyMigrated: false,
      };
      await db.legacyUser.create({
        data: legacyAccountInfo,
      });
      console.info(
        `Created legacy user ${legacyId}: ${prettyPrint(legacyAccountInfo)}`,
      );
      legacyId++;
    } catch (e) {
      console.error(`Error creating legacy user ${legacyId}: ${e}`);
    }
  }

  const users = await db.user.findMany({ select: { id: true } });
  for (const user of users) {
    const userId = user.id;
    const nofDeposits = randomInteger(1, maxDepositsPerUser);
    for (let i = 1; i <= nofDeposits; i++) {
      try {
        const [deposit, oldBalanceUpdated, newBalanceInserted] =
          await db.$transaction(
            async (tx) => {
              const now = new Date();

              const deposit = await tx.deposit.create({
                data: {
                  amount: randomMoney(maxDepositAmount),
                  userId: userId,
                },
              });

              const latestBalance = await tx.userBalance.findFirst({
                where: {
                  userId: userId,
                  isActive: true,
                },
              });

              if (!latestBalance) {
                throw new ValueError({
                  cause: "missing_value",
                  message: "No active balance found",
                });
              }

              const oldBalanceUpdated = await tx.userBalance.update({
                where: {
                  userId_validStart: {
                    validStart: latestBalance.validStart,
                    userId: userId,
                  },
                },
                data: {
                  validEnd: now,
                  isActive: false,
                },
              });

              const newBalanceInserted = await tx.userBalance.create({
                data: {
                  userId: userId,
                  balance: latestBalance.balance.add(deposit.amount),
                  validStart: now,
                  isActive: true,
                },
              });
              return [deposit, oldBalanceUpdated, newBalanceInserted];
            },
            {
              isolationLevel: "RepeatableRead",
            },
          );
        console.info(
          `Created deposit ${i} for user ${userId}: ${prettyPrint(deposit)}`,
        );
        console.info(`Old balance: ${prettyPrint(oldBalanceUpdated)}`);
        console.info(`New balance: ${prettyPrint(newBalanceInserted)}`);
      } catch (e) {
        if (e instanceof ValueError) {
          console.error(e.toString());
        } else {
          console.error(`Error creating deposit ${i} for user ${userId}: ${e}`);
        }
      }
    }
  }

  for (let i = 1; i <= nofProducts; i++) {
    const product = await createProduct(db, {
      name: `Product ${i}`,
      description: `Description for Product ${i}`,
      category: _.sample(ProductCategory) || "FOOD",
      price: randomMoney(maxProductPrice),
      imageFilePath:
        "https://namukilke.blob.core.windows.net/staging/namu-default.jpg",
      stock: 0,
    });
    console.info(`Created product ${i}: ${prettyPrint(product)}`);
  }

  for (let i = 1; i <= nofRestocks; i++) {
    try {
      const restock = await db.$transaction(
        async (tx) => {
          const now = new Date();
          const nofRestockItems = randomInteger(1, maxRestockItems);
          const randomProducts = await tx.product.findMany({
            select: { id: true },
            take: nofRestockItems,
            skip: randomInteger(0, nofProducts - nofRestockItems),
          });

          const restockItems = randomProducts.map((product) => {
            const cost = new Decimal(randomMoney(maxProductPrice));
            const quantity = randomInteger(1, maxSingleRestockItemQuantity);
            return {
              productId: product.id,
              quantity,
              singleItemCost: cost,
              totalCost: cost.mul(quantity),
            };
          });

          const totalCost = restockItems.reduce(
            (acc, item) => acc.add(item.totalCost),
            new Decimal(0),
          );

          const restock = await tx.restock.create({
            data: {
              totalCost,
              RestockItem: {
                createMany: {
                  data: restockItems,
                },
              },
            },
          });

          for (const item of restockItems) {
            const currentInventory = await tx.productInventory.findFirst({
              where: {
                productId: item.productId,
                isActive: true,
              },
            });

            if (!currentInventory) {
              throw new ValueError({
                cause: "missing_value",
                message: `No inventory found for product ${item.productId}`,
              });
            }

            await tx.productInventory.update({
              where: {
                productId_validStart: {
                  productId: item.productId,
                  validStart: currentInventory.validStart,
                },
              },
              data: {
                validEnd: now,
                isActive: false,
              },
            });

            await tx.productInventory.create({
              data: {
                productId: item.productId,
                quantity: currentInventory.quantity + item.quantity,
                validStart: now,
                isActive: true,
              },
            });
          }
          return restock;
        },
        {
          isolationLevel: "RepeatableRead",
        },
      );
      console.info(`Created restock ${i}: ${prettyPrint(restock)}`);
    } catch (e) {
      if (e instanceof ValueError) {
        console.error(e.toString());
      } else {
      }
      console.error(`Error creating restock ${i}: ${e}`);
    }
  }

  for (const user of users) {
    const userId = user.id;
    const nofTransactions = randomInteger(0, maxTransactions);
    for (let i = 1; i <= nofTransactions; i++) {
      try {
        const [transaction, oldUpdatedBalance, newCreatedBalance] =
          await db.$transaction(
            async (tx) => {
              const nofTransactionItems = randomInteger(
                1,
                maxItemsPerTransaction,
              );
              const now = new Date();
              const randomProductsWithPrices = await tx.product.findMany({
                take: nofTransactionItems,
                skip: randomInteger(0, nofProducts - nofTransactionItems),
                include: {
                  Prices: {
                    where: { isActive: true },
                    select: { price: true },
                  },
                  ProductInventory: {
                    where: { isActive: true },
                    select: { quantity: true, validStart: true },
                  },
                },
              });

              const transactionItemsWithStock = randomProductsWithPrices.map(
                (randomProduct) => {
                  const quantity = randomInteger(
                    1,
                    maxSingleTransactionItemQuantity,
                  );
                  const singleItemPrice = randomProduct.Prices[0]?.price;
                  if (!singleItemPrice) {
                    throw new ValueError({
                      cause: "missing_value",
                      message: `No price found for product ${randomProduct.id}`,
                    });
                  }

                  const inventory = randomProduct.ProductInventory[0];

                  if (!inventory) {
                    throw new ValueError({
                      cause: "missing_value",
                      message: `No inventory found for product ${randomProduct.id}`,
                    });
                  }

                  if (inventory.quantity < quantity) {
                    throw new ValueError({
                      cause: "invalid_value",
                      message: `Insufficient stock for product ${randomProduct.id}: stock ${inventory.quantity} < quantity ${quantity}`,
                    });
                  }

                  tx.productInventory.update({
                    where: {
                      productId_validStart: {
                        productId: randomProduct.id,
                        validStart: inventory.validStart,
                      },
                    },
                    data: {
                      validEnd: now,
                      isActive: false,
                    },
                  });

                  tx.productInventory.create({
                    data: {
                      productId: randomProduct.id,
                      quantity: inventory.quantity - quantity,
                      validStart: now,
                      isActive: true,
                    },
                  });

                  return {
                    productId: randomProduct.id,
                    quantity: quantity,
                    singleItemPrice: singleItemPrice,
                    totalPrice: singleItemPrice.mul(quantity),
                  };
                },
              );

              const transactionItems = transactionItemsWithStock.map((item) => {
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  singleItemPrice: item.singleItemPrice,
                  totalPrice: item.totalPrice,
                };
              });

              const totalPrice = transactionItems.reduce(
                (acc, item) => acc.add(item.totalPrice),
                new Decimal(0),
              );

              const currentUserBalance = await tx.userBalance.findFirst({
                where: {
                  userId,
                  isActive: true,
                },
              });

              if (!currentUserBalance) {
                throw new ValueError({
                  cause: "missing_value",
                  message: `No active balance found for user ${userId}`,
                });
              }

              if (currentUserBalance.balance.lt(totalPrice)) {
                throw new ValueError({
                  cause: "missing_value",
                  message: `Insufficient balance for user ${userId}: current balance of ${currentUserBalance.balance} < price of ${totalPrice}`,
                });
              }

              const newBalance = currentUserBalance.balance.sub(totalPrice);

              const oldUpdatedBalance = await tx.userBalance.update({
                where: {
                  userId_validStart: {
                    userId,
                    validStart: currentUserBalance.validStart,
                  },
                },
                data: {
                  validEnd: now,
                  isActive: false,
                },
              });

              const newCreatedBalance = await tx.userBalance.create({
                data: {
                  userId,
                  balance: newBalance,
                  validStart: now,
                  isActive: true,
                },
              });

              const transaction = await tx.transaction.create({
                data: {
                  totalPrice,
                  userId,
                  TransactionItem: {
                    createMany: {
                      data: transactionItems,
                    },
                  },
                },
              });
              return [transaction, oldUpdatedBalance, newCreatedBalance];
            },
            {
              isolationLevel: "RepeatableRead",
            },
          );

        console.info(
          `Created transaction ${i} for user ${userId}: ${prettyPrint(
            transaction,
          )}`,
        );
        console.info(`Old balance: ${prettyPrint(oldUpdatedBalance)}`);
        console.info(`New balance: ${prettyPrint(newCreatedBalance)}`);
      } catch (e) {
        if (e instanceof ValueError) {
          console.error(e.toString());
        } else {
          console.error(
            `Error creating transaction ${i} for user ${userId}: ${e}`,
          );
        }
      }
    }
  }

  for (const nationality of nationalities) {
    for (const foodName of foodNames) {
      const url = Math.random() < 0.2 ? "https://prisma.fi" : null;
      await db.wish.create({
        data: {
          title: `${_.sample(nationalities)} ${_.sample(foodNames)}`,
          description: `Description for wish ${nationality} - ${foodName}`,
          webUrl: url,
        },
      });
    }
  }

  for (const user of users) {
    const nofLikes = randomInteger(0, maxLikesPerUser);
    const randomStartingWishId = randomInteger(1, maxLikesPerUser - nofLikes);
    for (
      let j = randomStartingWishId;
      j < randomStartingWishId + nofLikes;
      j++
    ) {
      await db.wishLike.create({
        data: {
          userId: user.id,
          wishId: j,
        },
      });
    }
  }
}

generateTestData()
  .catch((e) => {
    console.error(`An error occurred while creating test data: ${e}`);
  })
  .finally(async () => {
    console.info("Script finished.");
    await db.$disconnect();
  });
