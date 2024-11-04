/*
  Warnings:

  - A unique constraint covering the columns `[nfcSerialHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_nfcSerialHash_key" ON "User"("nfcSerialHash");
