-- DropForeignKey
ALTER TABLE `sense` DROP FOREIGN KEY `Sense_termId_fkey`;

-- DropForeignKey
ALTER TABLE `senseexample` DROP FOREIGN KEY `SenseExample_senseId_fkey`;

-- DropIndex
DROP INDEX `Sense_termId_fkey` ON `sense`;

-- DropIndex
DROP INDEX `SenseExample_senseId_fkey` ON `senseexample`;

-- AddForeignKey
ALTER TABLE `Sense` ADD CONSTRAINT `Sense_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenseExample` ADD CONSTRAINT `SenseExample_senseId_fkey` FOREIGN KEY (`senseId`) REFERENCES `Sense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
