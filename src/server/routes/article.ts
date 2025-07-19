import { TRPCError } from "@trpc/server";

import { articleZodSchemas } from "@/types/articles";
import {
  prismaCreateArticleByUserId,
  prismaCreateArticleChapterByArticleId,
  prismaDeleteArticleById,
  prismaDeleteArticleChapterById,
  prismaGetArticleById,
  prismaGetArticleChapterByOrder,
  prismaGetArticleChapterListByArticleId,
  prismaGetArticleListByUserId,
  prismaUpdateArticleById,
  prismaUpdateArticleChapterById,
} from "../db/article";
import { t } from "../utils/trpc/init";
import { trpcAuthMiddleware } from "../utils/trpc/trpc-middlewares";

/**
 * get article list
 */
export const getArticleListByUserId = t.procedure.use(trpcAuthMiddleware).query(async ({ ctx }) => {
  try {
    const user = await prismaGetArticleListByUserId({
      userId: ctx.account!.id,
    });
    return user;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR", // 500
      message: `Failed to get article list by user id. ${(error as Error).message}`,
    });
  }
});

/**
 * get article
 */
export const getArticleById = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.GetArticleByIdInput)
  .query(async ({ input }) => {
    try {
      const article = await prismaGetArticleById(input);
      return article;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to get article by id. ${(error as Error).message}`,
      });
    }
  });

/**
 * get article's chapters list
 */
export const getArticleChapterListByArticleId = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.GetArticleChapterListByArticleIdInput)
  .query(async ({ input }) => {
    try {
      const chapters = await prismaGetArticleChapterListByArticleId(input);
      return chapters;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to get article chapter list by article id. ${(error as Error).message}`,
      });
    }
  });

/**
 * get article's chapter
 */
export const getArticleChapterByOrder = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.GetArticleChapterByOrderInput)
  .query(async ({ input }) => {
    try {
      const chapter = await prismaGetArticleChapterByOrder(input);
      return chapter;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to get article chapter by id. ${(error as Error).message}`,
      });
    }
  });

/**
 * create article ( empty chapters )
 */
export const createArticleByUserId = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.CreateArticleByUserIdInput)
  .mutation(async ({ input, ctx }) => {
    try {
      const article = await prismaCreateArticleByUserId({
        userId: ctx.account!.id,
        title: input.title,
        imgUrl: input.imgUrl,
      });
      return article;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to create article by user id. ${(error as Error).message}`,
      });
    }
  });

/**
 * create article's chapter
 */
export const createArticleChapterByArticleId = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.CreateArticleChapterByArticleIdInput)
  .mutation(async ({ input }) => {
    try {
      const chapter = await prismaCreateArticleChapterByArticleId(input);
      return chapter;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to create article chapter by article id. ${(error as Error).message}`,
      });
    }
  });

/**
 * update article
 */
export const updateArticleById = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.UpdateArticleByIdInput)
  .mutation(async ({ input }) => {
    try {
      const article = await prismaUpdateArticleById(input);
      return article;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to update article by id. ${(error as Error).message}`,
      });
    }
  });

/**
 * update article's chapter
 */
export const updateArticleChapterById = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.UpdateArticleChapterByIdInput)
  .mutation(async ({ input }) => {
    try {
      const chapter = await prismaUpdateArticleChapterById(input);
      return chapter;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to update article chapter by id. ${(error as Error).message}`,
      });
    }
  });

/**
 * delete article
 */
export const deleteArticleById = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.DeleteArticleByIdInput)
  .mutation(async ({ input }) => {
    try {
      const article = await prismaDeleteArticleById(input);
      return article;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to delete article by id. ${(error as Error).message}`,
      });
    }
  });

/**
 * delete article's chapter
 */
export const deleteArticleChapterById = t.procedure
  .use(trpcAuthMiddleware)
  .input(articleZodSchemas.DeleteArticleChapterByIdInput)
  .mutation(async ({ input }) => {
    try {
      const chapter = await prismaDeleteArticleChapterById(input);
      return chapter;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", // 500
        message: `Failed to delete article chapter by id. ${(error as Error).message}`,
      });
    }
  });
