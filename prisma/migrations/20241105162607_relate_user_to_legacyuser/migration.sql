/*
  Warnings:

  - You are about to drop the column `alreadyMigrated` on the `LegacyUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[newAccountId]` on the table `LegacyUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LegacyUser" DROP COLUMN "alreadyMigrated",
ADD COLUMN     "newAccountId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "LegacyUser_newAccountId_key" ON "LegacyUser"("newAccountId");

-- AddForeignKey
ALTER TABLE "LegacyUser" ADD CONSTRAINT "LegacyUser_newAccountId_fkey" FOREIGN KEY ("newAccountId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
