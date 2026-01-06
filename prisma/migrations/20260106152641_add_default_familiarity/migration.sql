-- AlterTable
ALTER TABLE `userterm` MODIFY `familiarity` ENUM('NEW', 'RECOGNIZED', 'FAMILIAR') NOT NULL DEFAULT 'NEW';
