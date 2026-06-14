-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('SNOOZED', 'DISMISSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "AnnouncementSetting" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnouncementSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnnouncementState" (
    "userId" INTEGER NOT NULL,
    "announcementId" TEXT NOT NULL,
    "status" "AnnouncementStatus" NOT NULL,
    "lastShownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnnouncementState_pkey" PRIMARY KEY ("userId","announcementId")
);

-- CreateIndex
CREATE INDEX "UserAnnouncementState_announcementId_idx" ON "UserAnnouncementState"("announcementId");

-- AddForeignKey
ALTER TABLE "UserAnnouncementState" ADD CONSTRAINT "UserAnnouncementState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
