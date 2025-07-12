-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPER_USER', 'NORMAL_USER');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('MEMO', 'GALLERY', 'STORY');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" TEXT NOT NULL,
    "type" "NoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_memo" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "note_memo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_gallery" (
    "id" TEXT NOT NULL,
    "imgUrls" TEXT[],

    CONSTRAINT "note_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,

    CONSTRAINT "note_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_story_chapter" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "note_story_chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "note_user_id_idx" ON "note"("user_id");

-- CreateIndex
CREATE INDEX "note_story_chapter_story_id_idx" ON "note_story_chapter"("story_id");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_memo" ADD CONSTRAINT "note_memo_id_fkey" FOREIGN KEY ("id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_gallery" ADD CONSTRAINT "note_gallery_id_fkey" FOREIGN KEY ("id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_story" ADD CONSTRAINT "note_story_id_fkey" FOREIGN KEY ("id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_story_chapter" ADD CONSTRAINT "note_story_chapter_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "note_story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
