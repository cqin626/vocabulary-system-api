-- CreateTable
CREATE TABLE `Term` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `termId` INTEGER NOT NULL,
    `definition` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SenseExample` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senseId` INTEGER NOT NULL,
    `exampleSentence` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sense` ADD CONSTRAINT `Sense_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenseExample` ADD CONSTRAINT `SenseExample_senseId_fkey` FOREIGN KEY (`senseId`) REFERENCES `Sense`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
