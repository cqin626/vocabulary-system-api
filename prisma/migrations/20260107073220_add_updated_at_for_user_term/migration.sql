/*
  Warnings:

  - Added the required column `updatedAt` to the `UserTerm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userterm` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
