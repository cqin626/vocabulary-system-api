/*
  Warnings:

  - You are about to drop the column `type` on the `term` table. All the data in the column will be lost.
  - Added the required column `type` to the `Sense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sense` ADD COLUMN `type` ENUM('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PRONOUN', 'PREPOSITION', 'CONJUNCTION', 'INTERJECTION', 'PHRASAL_VERB', 'IDIOM', 'PHRASE') NOT NULL;

-- AlterTable
ALTER TABLE `term` DROP COLUMN `type`;
