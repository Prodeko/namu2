-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('MOBILE', 'DESKTOP', 'GUILDROOM_TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "LoginMethod" AS ENUM ('PASSOWRD', 'RFID');

-- CreateTable
CREATE TABLE "UserLogin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginMethod" "LoginMethod" NOT NULL,
    "deviceType" "DeviceType" NOT NULL,

    CONSTRAINT "UserLogin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLogin" ADD CONSTRAINT "UserLogin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
