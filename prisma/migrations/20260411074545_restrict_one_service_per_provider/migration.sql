/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "providerType" "Category";

-- CreateIndex
CREATE UNIQUE INDEX "Service_userId_key" ON "Service"("userId");
