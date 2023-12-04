import { PrismaClient, ProductCategory } from "@prisma/client";
import bcrypt from "bcrypt";
import _ from "lodash";

const prisma = new PrismaClient();

async function main() {
  // Create 5 users, with one being an admin
  const firstNames = ["John", "Jane", "Bob", "Alice", "Eve"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];

  for (let i = 1; i <= 5; i++) {
    console.log(`Creating user ${i}...`);
    try {
      const hashedPin = await bcrypt.hash("1234", 10);
      const randomFirstName = _.sample(firstNames) || "Matti";
      const randomLastName = _.sample(lastNames) || "Meikäläinen";

      const user = await prisma.user.create({
        data: {
          firstName: randomFirstName,
          lastName: randomLastName,
          userName: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}.${i}`,
          pinHash: hashedPin,
          isAdmin: i === 1, // Make the first user an admin
        },
      });
      console.log("Created user: ", user);
    } catch (e) {
      console.log("Error creating user: ", e);
    }
  }

  for (let i = 1; i <= 20; i++) {
    console.log(`Creating product ${i}...`);
    await prisma.product.create({
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
}

main()
  .catch((e) => {
    console.log("An error occurred while running the script: ", e);
  })
  .finally(async () => {
    console.log("Script finished.");
    await prisma.$disconnect();
  });
