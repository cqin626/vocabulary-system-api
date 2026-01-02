/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `Term` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Term_text_key` ON `Term`(`text`);
