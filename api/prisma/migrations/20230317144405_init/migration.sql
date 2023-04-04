/*
  Warnings:

  - You are about to alter the column `stock` on the `products` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `stock` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
