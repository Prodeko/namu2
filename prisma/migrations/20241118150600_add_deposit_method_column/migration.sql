-- CreateEnum
CREATE TYPE "DepositMethod" AS ENUM ('MANUAL_MOBILEPAY', 'STRIPE');

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "depositMethod" "DepositMethod";
