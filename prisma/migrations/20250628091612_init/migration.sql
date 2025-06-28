/*
  Warnings:

  - You are about to drop the `NoteOfMemo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NoteOfStory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NoteOfMemo" DROP CONSTRAINT "NoteOfMemo_id_fkey";

-- DropForeignKey
ALTER TABLE "NoteOfStory" DROP CONSTRAINT "NoteOfStory_id_fkey";

-- DropTable
DROP TABLE "NoteOfMemo";

-- DropTable
DROP TABLE "NoteOfStory";
