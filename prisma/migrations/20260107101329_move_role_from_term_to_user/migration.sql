/*
  Warnings:

  - You are about to drop the column `role` on the `term` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `term` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
