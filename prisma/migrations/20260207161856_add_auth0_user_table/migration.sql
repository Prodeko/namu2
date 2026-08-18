-- AlterEnum
ALTER TYPE "LoginMethod" ADD VALUE 'AUTH0';

-- CreateTable
CREATE TABLE "Auth0User" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "auth0Sub" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth0User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth0User_userId_key" ON "Auth0User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth0User_auth0Sub_key" ON "Auth0User"("auth0Sub");

-- CreateIndex
CREATE INDEX "Auth0User_auth0Sub_idx" ON "Auth0User"("auth0Sub");

-- AddForeignKey
ALTER TABLE "Auth0User" ADD CONSTRAINT "Auth0User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
