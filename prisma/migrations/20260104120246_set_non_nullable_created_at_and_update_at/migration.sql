/*
  Warnings:

  - Made the column `updatedAt` on table `sense` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `senseexample` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `term` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sense` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `senseexample` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `term` MODIFY `updatedAt` DATETIME(3) NOT NULL;
