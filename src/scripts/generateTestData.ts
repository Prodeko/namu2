import _ from "lodash";

import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import { ProductCategory } from "@prisma/client";
import { Role } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Resets the database by deleting all users and products, and resetting the auto-incrementing IDs.
 */
async function resetDatabase() {
  // Delete entries in reverse order of dependency
  await db.transactionItem.deleteMany({});
  await db.restockItem.deleteMany({});
  await db.deposit.deleteMany({});
  await db.transaction.deleteMany({});
  await db.restock.deleteMany({});
  await db.productPrice.deleteMany({});
  await db.userBalance.deleteMany({});
  await db.user.deleteMany({});
  await db.product.deleteMany({});
  await db.wish.deleteMany({});
  await db.wishLike.deleteMany({});

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

const randomDecimal = (max: number): Decimal => {
  return new Decimal((Math.random() * max).toFixed(2));
};

async function generateTestData() {
  await resetDatabase();

  // Create 25 users, with one being an admin
  const firstNames = ["John", "Jane", "Bob", "Alice", "Eve"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];
  const maxDepositAmount = 200;
  const maxProductPrice = 10;
  const maxRestockItems = 50;
  const maxSingleRestockItemQuantity = 20;
  const maxTransactions = 20;
  const maxItemsPerTransaction = 10;
  const maxSingleTransactionItemQuantity = 5;
  const nofProducts = 50;
  const nofRestocks = 200;
  const nofDeposits = 200;
  const nofUsers = firstNames.length * lastNames.length;

  let adminIdx = 1;
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      try {
        const hashedPin = await createPincodeHash("1234");
        const user = await db.user.create({
          data: {
            firstName,
            lastName,
            userName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
            pinHash: hashedPin,
            role: adminIdx === 1 ? Role.ADMIN : Role.USER, // Make the first user an admin
            Balances: {
              create: {
                balance: 0,
              },
            },
          },
        });
        console.info(`Created user ${adminIdx}: ${user}`);
        adminIdx++;
      } catch (e) {
        console.error(`Error creating user ${adminIdx}: ${e}`);
      }
    }
  }

  for (let i = 1; i <= nofDeposits; i++) {
    try {
      const [deposit, oldBalanceUpdated, newBalanceInserted] =
        await db.$transaction(
          async (tx) => {
            const now = new Date();

            const user = await tx.user.findFirst({
              select: { id: true },
              skip: randomInteger(1, nofUsers),
            });

            if (!user) {
              throw new Error("No user found!");
            }

            const deposit = await tx.deposit.create({
              data: {
                amount: randomInteger(1, maxDepositAmount),
                userId: user.id,
              },
            });

            const latestBalance = await tx.userBalance.findFirst({
              where: {
                userId: user.id,
                isActive: true,
              },
            });

            if (!latestBalance) {
              throw new Error("No active balance found");
            }

            const oldBalanceUpdated = tx.userBalance.update({
              where: {
                userId_validStart: {
                  validStart: latestBalance.validStart,
                  userId: user.id,
                },
              },
              data: {
                validEnd: now,
                isActive: false,
              },
            });

            const newBalanceInserted = tx.userBalance.create({
              data: {
                userId: user.id,
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
      console.info(`Created deposit ${i}: ${deposit}`);
      console.info(`Old balance: ${oldBalanceUpdated}`);
      console.info(`New balance: ${newBalanceInserted}`);
    } catch (e) {
      console.error(`Error creating deposit ${i}: ${e}`);
    }
  }

  for (let i = 1; i <= nofProducts; i++) {
    try {
      const product = await db.product.create({
        data: {
          name: `Product ${i}`,
          description: `Description for Product ${i}`,
          stock: 0,
          imageUrl: `http://example.com/image${i}.jpg`,
          category: _.sample(ProductCategory) || "FOOD",
          Prices: {
            create: {
              price: randomDecimal(maxProductPrice),
            },
          },
        },
      });
      console.info(`Created product ${i}: ${product}`);
    } catch (e) {
      throw new Error(`Error creating product ${i}: ${e}`);
    }
  }

  for (let i = 1; i <= nofRestocks; i++) {
    try {
      const restock = await db.$transaction(
        async (tx) => {
          const nofRestockItems = randomInteger(1, maxRestockItems);
          const randomProducts = await tx.product.findMany({
            select: { id: true },
            take: nofRestockItems,
            skip: randomInteger(0, nofProducts - nofRestockItems),
          });

          const restockItems = randomProducts.map((product) => {
            const cost = randomDecimal(maxProductPrice);
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
            await tx.product.update({
              where: {
                id: item.productId,
              },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
          return restock;
        },
        {
          isolationLevel: "RepeatableRead",
        },
      );
      console.info(`Created restock ${i}: ${restock}`);
    } catch (e) {
      console.error(`Error creating restock ${i}: ${e}`);
    }
  }

  const users = await db.user.findMany({ select: { id: true } });
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
                    throw new Error(
                      `No price found for product ${randomProduct.id}`,
                    );
                  }
                  return {
                    productId: randomProduct.id,
                    quantity: quantity,
                    singleItemPrice: singleItemPrice,
                    totalPrice: singleItemPrice.mul(quantity),
                    stock: randomProduct.stock,
                  };
                },
              );

              for (const item of transactionItemsWithStock) {
                if (item.stock < item.quantity) {
                  throw new Error(
                    `Insufficient stock for product ${item.productId}: stock ${item.stock} < quantity ${item.quantity}`,
                  );
                }
              }

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
                throw new Error("No active balance found");
              }

              if (currentUserBalance.balance.lt(totalPrice)) {
                throw new Error(
                  `Insufficient balance: current balance of ${currentUserBalance.balance} < price of ${totalPrice}`,
                );
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
          `Created transaction ${i} for user ${userId}: ${transaction}`,
        );
        console.info(`Old balance: ${oldUpdatedBalance}`);
        console.info(`New balance: ${newCreatedBalance}`);
      } catch (e) {
        console.error(
          `Error creating transaction ${i} for user ${userId}: ${e}`,
        );
      }
    }
  }

  const nationalities = ["English", "French", "German", "Italian", "Spanish"];
  const foodNames = ["Hamburger", "Pizza", "Taco", "Sushi", "Pasta"];

  for (let i = 1; i <= 20; i++) {
    console.info(`Creating wish ${i}...`);
    const url = Math.random() < 0.2 ? "https://prisma.fi" : null;
    await db.wish.create({
      data: {
        title: `${_.sample(nationalities)} ${_.sample(foodNames)}`,
        description: `Description for Wish ${i}`,
        webUrl: url,
      },
    });
  }

  for (let i = 1; i <= 20; i++) {
    for (let j = 1; j <= 20; j++) {
      const rand = Math.random();
      if (rand < Math.random()) continue;
      console.info(`Creating wish like ${i}...`);
      await db.wishLike.create({
        data: {
          userId: i,
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
