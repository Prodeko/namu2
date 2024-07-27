/*
  Warnings:

  - You are about to alter the column `amount` on the `Deposit` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `price` on the `ProductPrice` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `totalCost` on the `Restock` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `singleItemCost` on the `RestockItem` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `totalCost` on the `RestockItem` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `totalPrice` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `singleItemPrice` on the `TransactionItem` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `totalPrice` on the `TransactionItem` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `balance` on the `UserBalance` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "ProductPrice" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Restock" ALTER COLUMN "totalCost" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "RestockItem" ALTER COLUMN "singleItemCost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "totalCost" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "TransactionItem" ALTER COLUMN "singleItemPrice" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "UserBalance" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,2);
