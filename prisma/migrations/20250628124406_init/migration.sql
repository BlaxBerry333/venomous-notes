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
