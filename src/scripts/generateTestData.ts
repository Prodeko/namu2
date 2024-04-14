import _ from "lodash";

import { db } from "@/server/db/prisma";
import { createPincodeHash } from "@/server/db/utils/auth";
import { ProductCategory } from "@prisma/client";
import { Role } from "@prisma/client";

/**
 * Resets the database by deleting all users and products, and resetting the auto-incrementing IDs.
 */
async function resetDatabase() {
  await db.user.deleteMany({});
  await db.product.deleteMany({});
  await db.wish.deleteMany({});
  await db.wishLike.deleteMany({});

  await db.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "Wish_id_seq" RESTART WITH 1`;
  await db.$executeRaw`ALTER SEQUENCE "WishLike_id_seq" RESTART WITH 1`;
}

async function generateTestData() {
  await resetDatabase();
  // Create 5 users, with one being an admin
  const firstNames = ["John", "Jane", "Bob", "Alice", "Eve"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];

  let i = 1;
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      console.info(`Creating user ${i}...`);
      try {
        const hashedPin = await createPincodeHash("1234");

        const user = await db.user.create({
          data: {
            firstName,
            lastName,
            userName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
            pinHash: hashedPin,
            role: i === 1 ? Role.ADMIN : Role.USER, // Make the first user an admin
          },
        });
        console.info("Created user: ", user);
        i++;
      } catch (e) {
        console.info("Error creating user: ", e);
      }
    }
  }

  for (let i = 1; i <= 20; i++) {
    console.info(`Creating product ${i}...`);
    await db.product.create({
      data: {
        name: `Product ${i}`,
        description: `Description for Product ${i}`,
        sellingPrice: Math.floor(Math.random() * 100) + 1, // Random selling price
        originalCost: Math.floor(Math.random() * 100), // Random original cost
        stock: Math.floor(Math.random() * 10), // Random stock quantity
        imageUrl: `http://example.com/image${i}.jpg`,
        category: _.sample(ProductCategory) || "FOOD", // Cycles through the categories
      },
    });
  }

  const nationalities = ["English", "French", "German", "Italian", "Spanish"];
  const foodNames = ["Hamburger", "Pizza", "Taco", "Sushi", "Pasta"];

  for (let i = 1; i <= 20; i++) {
    console.info(`Creating wish ${i}...`);
    await db.wish.create({
      data: {
        title: `${_.sample(nationalities)} ${_.sample(foodNames)}`,
        description: `Description for Wish ${i}`,
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
    console.info("An error occurred while running the script: ", e);
  })
  .finally(async () => {
    console.info("Script finished.");
    await db.$disconnect();
  });
