-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('MEMO', 'STORY');

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "type" "NoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteOfMemo" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "NoteOfMemo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteOfStory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "NoteOfStory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NoteOfMemo" ADD CONSTRAINT "NoteOfMemo_id_fkey" FOREIGN KEY ("id") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteOfStory" ADD CONSTRAINT "NoteOfStory_id_fkey" FOREIGN KEY ("id") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
