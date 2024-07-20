/*
  Warnings:

  - Added the required column `description` to the `Wish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wish" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "webUrl" TEXT;
