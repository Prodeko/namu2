-- CreateTable
CREATE TABLE "LegacyUser" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "alreadyMigrated" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "LegacyUser_id_key" ON "LegacyUser"("id");
