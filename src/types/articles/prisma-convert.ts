import type { Article, ArticleChapter } from "@/.generated/prisma";
import type { IUser } from "../account";

export type IArticle = {
  id: Article["id"];
  title: Article["title"];
  userId: IUser["id"];
  imgUrl: Article["imgUrl"];
  orders: Article["orders"];
};

export type IArticleChapter = {
  id: ArticleChapter["id"];
  title: ArticleChapter["title"];
  createdAt: string;
  updatedAt: string;
  articleId: Article["id"];
  order: ArticleChapter["order"];
  content: string;
};
