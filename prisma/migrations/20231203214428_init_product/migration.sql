-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('FOOD', 'DRINK', 'SNACK');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "sellingPrice" MONEY NOT NULL,
    "originalCost" MONEY,
    "stock" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
