-- CreateEnum
CREATE TYPE "WishStatus" AS ENUM ('OPEN', 'ACCEPTED', 'REJECTD');

-- CreateTable
CREATE TABLE "Wish" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "status" "WishStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "responseMsg" VARCHAR(250),

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishLike" (
    "id" SERIAL NOT NULL,
    "wishId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishLike_pkey" PRIMARY KEY ("id")
);
