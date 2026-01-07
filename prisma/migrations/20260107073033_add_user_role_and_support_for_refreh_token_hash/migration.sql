-- DropIndex
DROP INDEX `Term_text_idx` ON `term`;

-- AlterTable
ALTER TABLE `refreshtoken` MODIFY `token` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `term` ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
