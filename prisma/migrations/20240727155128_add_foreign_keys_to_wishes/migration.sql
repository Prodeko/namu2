/*
  Warnings:

  - A unique constraint covering the columns `[wishId,userId]` on the table `WishLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WishLike_wishId_userId_key" ON "WishLike"("wishId", "userId");

-- AddForeignKey
ALTER TABLE "WishLike" ADD CONSTRAINT "WishLike_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishLike" ADD CONSTRAINT "WishLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
