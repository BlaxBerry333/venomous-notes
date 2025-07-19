import { createUser, getUserByEmail } from "./account";
import {
  createArticleByUserId,
  createArticleChapterByArticleId,
  deleteArticleById,
  deleteArticleChapterById,
  getArticleById,
  getArticleChapterByOrder,
  getArticleChapterListByArticleId,
  getArticleListByUserId,
  updateArticleById,
  updateArticleChapterById,
} from "./article";

export const AccountRoutes = {
  createUser,
  getUserByEmail,
};

export const ArticleRoutes = {
  getArticleListByUserId,
  getArticleById,
  getArticleChapterListByArticleId,
  getArticleChapterByOrder,
  createArticleByUserId,
  createArticleChapterByArticleId,
  updateArticleById,
  updateArticleChapterById,
  deleteArticleById,
  deleteArticleChapterById,
};
