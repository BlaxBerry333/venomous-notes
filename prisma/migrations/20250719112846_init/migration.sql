-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('super_user', 'normal_user');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "UserType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memos" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT,
    "orders" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_chapters" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "article_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "article_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foreign_language" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "foreign_language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foreign_language_words" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "should_review_at" TIMESTAMP(3),
    "foreign_language_id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT,
    "pronunciationAudio" TEXT,
    "exampleSentence" TEXT,

    CONSTRAINT "foreign_language_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foreign_language_expressions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "foreign_language_id" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "translation" TEXT,

    CONSTRAINT "foreign_language_expressions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "memos_user_id_idx" ON "memos"("user_id");

-- CreateIndex
CREATE INDEX "articles_user_id_idx" ON "articles"("user_id");

-- CreateIndex
CREATE INDEX "article_chapters_article_id_idx" ON "article_chapters"("article_id");

-- CreateIndex
CREATE INDEX "foreign_language_user_id_idx" ON "foreign_language"("user_id");

-- CreateIndex
CREATE INDEX "foreign_language_words_foreign_language_id_idx" ON "foreign_language_words"("foreign_language_id");

-- CreateIndex
CREATE INDEX "foreign_language_expressions_foreign_language_id_idx" ON "foreign_language_expressions"("foreign_language_id");

-- AddForeignKey
ALTER TABLE "memos" ADD CONSTRAINT "memos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_chapters" ADD CONSTRAINT "article_chapters_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreign_language" ADD CONSTRAINT "foreign_language_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreign_language_words" ADD CONSTRAINT "foreign_language_words_foreign_language_id_fkey" FOREIGN KEY ("foreign_language_id") REFERENCES "foreign_language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreign_language_expressions" ADD CONSTRAINT "foreign_language_expressions_foreign_language_id_fkey" FOREIGN KEY ("foreign_language_id") REFERENCES "foreign_language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
