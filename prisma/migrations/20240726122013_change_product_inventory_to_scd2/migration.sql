/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock";

-- CreateTable
CREATE TABLE "ProductInventory" (
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "validStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validEnd" TIMESTAMP(3) NOT NULL DEFAULT '9999-12-31 00:00:00 +00:00',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("productId","validStart")
);

-- CreateIndex
CREATE INDEX "ProductInventory_productId_validEnd_idx" ON "ProductInventory"("productId", "validEnd");

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
