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

const randomPrice = (max: number): Decimal => {
  return new Decimal((Math.random() * max).toFixed(2));
};

async function generateTestData() {
  await resetDatabase();

  // Create 25 users, with one being an admin
  const firstNames = ["John", "Jane", "Bob", "Alice", "Eve"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];
  const maxDepositAmount = 200;
  const maxProductPrice = 10;
  const maxRestockItems = 10;
  const maxSingleRestockItemQuantity = 20;
  const maxTransactions = 20;
  const maxItemsPerTransaction = 10;
  const maxSingleTransactionItemQuantity = 5;
  const nofProducts = 50;
  const nofRestocks = 50;
  const nofDeposits = 50;
  const nofUsers = firstNames.length * lastNames.length;

  let adminIdx = 1;
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      console.info(`Creating user ${adminIdx}...`);
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
        console.info("Created user: ", user);
        adminIdx++;
      } catch (e) {
        console.error("Error creating user: ", e);
      }
    }
  }

  for (let i = 1; i <= nofDeposits; i++) {
    console.info(`Creating deposit ${i}...`);
    try {
      const deposit = await db.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          select: { id: true },
          skip: randomInteger(1, nofUsers),
        });

        if (!user) {
          throw new Error("No not found");
        }

        return tx.deposit.create({
          data: {
            amount: randomInteger(1, maxDepositAmount),
            userId: user.id,
          },
        });
      });
      console.info("Created deposit: ", deposit);
    } catch (e) {
      console.error("Error creating deposit: ", e);
    }
  }

  for (let i = 1; i <= nofProducts; i++) {
    console.info(`Creating product ${i}...`);
    try {
      const product = await db.product.create({
        data: {
          name: `Product ${i}`,
          description: `Description for Product ${i}`,
          stock: 0,
          imageUrl: `http://example.com/image${i}.jpg`,
          category: _.sample(ProductCategory) || "FOOD",
        },
      });
      const productPrice = await db.productPrice.create({
        data: {
          productId: product.id,
          price: randomPrice(maxProductPrice),
        },
      });
      console.info("Created product: ", product);
      console.info("Created product price: ", productPrice);
    } catch (e) {
      console.error("Error creating product: ", e);
    }
  }

  for (let i = 1; i <= nofRestocks; i++) {
    console.info(`Creating restocks ${i}...`);
    try {
      const restock = await db.restock.create({
        data: {
          totalCost: 0,
        },
      });
      const nofRestockItems = randomInteger(1, maxRestockItems);
      let restockCost = 0;
      for (let j = 1; j <= nofRestockItems; j++) {
        const productId = randomInteger(1, nofProducts);
        const singleItemCost = await db.productPrice
          .findFirst({
            where: { productId, isActive: true },
            select: { price: true },
          })
          .then((price) => price?.price || new Decimal(0));
        const quantity = randomInteger(1, maxSingleRestockItemQuantity);
        const totalCost = quantity * singleItemCost.toNumber();
        restockCost += totalCost;
        const restockItem = await db.restockItem.create({
          data: {
            restockId: restock.id,
            productId: productId,
            quantity: quantity,
            singleItemCost: singleItemCost,
            totalCost: totalCost,
          },
        });
        console.info("Created restock item: ", restockItem);
      }
      await db.restock.update({
        where: { id: restock.id },
        data: { totalCost: restockCost },
      });
      console.info("Created restock: ", restock);
    } catch (e) {
      console.error("Error creating restock: ", e);
    }
  }

  const users = await db.user.findMany({ select: { id: true } });
  for (const user of users) {
    const userId = user.id;
    console.info(`Creating transactions for user ${userId}...`);
    const nofTransactions = randomInteger(0, maxTransactions);
    for (let i = 1; i <= nofTransactions; i++) {
      console.info(`Creating transaction ${i} for user ${userId}...`);
      try {
        const transaction = await db.transaction.create({
          data: {
            totalPrice: 0,
            userId,
          },
        });
        console.info("Created transaction: ", transaction);

        const nofTransactionItems = randomInteger(1, maxItemsPerTransaction);
        let totalPrice = 0;
        const products = await db.product.findMany({
          select: { id: true },
        });
        const productIds = products.map((product) => product.id);

        for (let j = 1; j <= nofTransactionItems; j++) {
          // Randomly select a product and remove it from the list
          const productIndex = randomInteger(0, productIds.length - 1);
          const productId = productIds[productIndex] as number;
          productIds.splice(productIndex, 1);

          const singleItemPrice = await db.productPrice
            .findFirst({
              where: { productId, isActive: true },
              select: { price: true },
            })
            .then((price) => price?.price || new Decimal(0));
          const quantity = randomInteger(1, maxSingleTransactionItemQuantity);
          const totalTransactionItemPrice =
            quantity * singleItemPrice.toNumber();
          totalPrice += totalTransactionItemPrice;
          const transactionItem = await db.transactionItem.create({
            data: {
              transactionId: transaction.id,
              productId: productId,
              quantity: quantity,
              singleItemPrice: singleItemPrice,
              totalPrice: totalTransactionItemPrice,
            },
          });

          console.info("Created transaction item: ", transactionItem);
        }
        const updatedTransaction = await db.transaction.update({
          where: { id: transaction.id },
          data: {
            totalPrice,
          },
        });
        console.info("Updated transaction: ", updatedTransaction);
      } catch (e) {
        console.error("Error creating transaction: ", e);
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
    console.error("An error occurred while running the script: ", e);
  })
  .finally(async () => {
    console.info("Script finished.");
    await db.$disconnect();
  });
