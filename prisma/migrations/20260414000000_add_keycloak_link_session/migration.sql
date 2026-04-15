-- CreateEnum
CREATE TYPE "KeycloakLinkSessionStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "KeycloakLinkSession" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "KeycloakLinkSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "linkedKeycloakSub" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeycloakLinkSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KeycloakLinkSession_userId_idx" ON "KeycloakLinkSession"("userId");

-- AddForeignKey
ALTER TABLE "KeycloakLinkSession" ADD CONSTRAINT "KeycloakLinkSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
