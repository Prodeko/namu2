/*
  Warnings:

  - You are about to drop the column `originalCost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `accountBalance` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "originalCost",
DROP COLUMN "sellingPrice";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountBalance";

-- CreateTable
CREATE TABLE "UserBalance" (
    "userId" INTEGER NOT NULL,
    "balance" MONEY NOT NULL,
    "validStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validEnd" TIMESTAMP(3) NOT NULL DEFAULT '9999-12-31 00:00:00 +00:00',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("userId","validStart")
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "productId" INTEGER NOT NULL,
    "price" MONEY NOT NULL,
    "validStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validEnd" TIMESTAMP(3) NOT NULL DEFAULT '9999-12-31 00:00:00 +00:00',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("productId","validStart")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalPrice" MONEY NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionItem" (
    "transactionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "singleItemPrice" MONEY NOT NULL,
    "totalPrice" MONEY NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("transactionId","productId")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" MONEY NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restock" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalCost" MONEY NOT NULL,

    CONSTRAINT "Restock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestockItem" (
    "restockId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "singleItemCost" MONEY NOT NULL,
    "totalCost" MONEY NOT NULL,

    CONSTRAINT "RestockItem_pkey" PRIMARY KEY ("restockId","productId")
);

-- CreateIndex
CREATE INDEX "UserBalance_userId_validEnd_idx" ON "UserBalance"("userId", "validEnd");

-- CreateIndex
CREATE INDEX "ProductPrice_productId_validEnd_idx" ON "ProductPrice"("productId", "validEnd");

-- CreateIndex
CREATE INDEX "Transaction_id_idx" ON "Transaction"("id");

-- CreateIndex
CREATE INDEX "TransactionItem_transactionId_idx" ON "TransactionItem"("transactionId");

-- CreateIndex
CREATE INDEX "Deposit_id_idx" ON "Deposit"("id");

-- CreateIndex
CREATE INDEX "Restock_id_idx" ON "Restock"("id");

-- CreateIndex
CREATE INDEX "RestockItem_restockId_idx" ON "RestockItem"("restockId");

-- CreateIndex
CREATE INDEX "Product_id_idx" ON "Product"("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestockItem" ADD CONSTRAINT "RestockItem_restockId_fkey" FOREIGN KEY ("restockId") REFERENCES "Restock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestockItem" ADD CONSTRAINT "RestockItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
