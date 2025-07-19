import prismaClient from "@/server/utils/prisma/prisma-client";
import { IArticle, IArticleChapter } from "@/types/articles";
import {
  ICreateArticleByUserIdInput,
  ICreateArticleChapterByArticleIdInput,
  IDeleteArticleByIdInput,
  IDeleteArticleChapterByIdInput,
  IGetArticleByIdInput,
  IGetArticleChapterByOrderInput,
  IGetArticleChapterListByArticleIdInput,
  IGetArticleListByUserId,
  IUpdateArticleByIdInput,
  IUpdateArticleChapterByIdInput,
} from "@/types/articles/zod-schema";

/**
 * get article list
 */
export async function prismaGetArticleListByUserId(input: IGetArticleListByUserId): Promise<IArticle[]> {
  const articles = await prismaClient.article.findMany({
    where: {
      userId: input.userId,
    },
    select: {
      id: true,
      title: true,
      userId: false,
      imgUrl: true,
    },
  });
  return articles as IArticle[];
}

/**
 * get article
 */
export async function prismaGetArticleById(input: IGetArticleByIdInput): Promise<IArticle | null> {
  const article = await prismaClient.article.findUnique({
    where: {
      id: input.id,
    },
  });
  return article as IArticle | null;
}

/**
 * get article's chapters list
 */
export async function prismaGetArticleChapterListByArticleId(input: IGetArticleChapterListByArticleIdInput): Promise<IArticleChapter[]> {
  const chapters = await prismaClient.articleChapter.findMany({
    where: {
      articleId: input.articleId,
    },
    orderBy: {
      order: "asc", // 按顺序字段排序
    },
    select: {
      id: true,
      title: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      articleId: true,
      content: true,
    },
  });
  return chapters.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  })) as IArticleChapter[];
}

/**
 * get article's chapter
 */
export async function prismaGetArticleChapterByOrder(input: IGetArticleChapterByOrderInput): Promise<IArticleChapter> {
  const chapter = await prismaClient.articleChapter.findFirst({
    where: {
      articleId: input.articleId,
      order: input.order,
    },
  });
  if (!chapter) {
    throw new Error("Chapter not found");
  }
  return {
    ...chapter,
    createdAt: chapter.createdAt.toISOString(),
    updatedAt: chapter.updatedAt.toISOString(),
  } as IArticleChapter;
}

/**
 * create article ( empty chapters )
 */
export async function prismaCreateArticleByUserId(input: ICreateArticleByUserIdInput & { userId: string }): Promise<IArticle> {
  const article = await prismaClient.article.create({
    data: {
      userId: input.userId,
      title: input.title,
      imgUrl: input.imgUrl,
    },
  });
  return article as IArticle;
}

/**
 * create article's chapter
 */
export async function prismaCreateArticleChapterByArticleId(input: ICreateArticleChapterByArticleIdInput): Promise<IArticleChapter> {
  const maxOrder = await prismaClient.articleChapter.aggregate({
    where: { articleId: input.articleId },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const [chapter] = await prismaClient.$transaction([
    // create chapter
    prismaClient.articleChapter.create({
      data: {
        articleId: input.articleId,
        title: input.title,
        content: input.content,
        order: nextOrder,
      },
    }),
    // update article.orders
    prismaClient.article.update({
      where: { id: input.articleId },
      data: { orders: { increment: 1 } },
    }),
  ]);

  if (!chapter) {
    throw new Error("Failed to create chapter");
  }
  return {
    ...chapter,
    createdAt: chapter.createdAt.toISOString(),
    updatedAt: chapter.updatedAt.toISOString(),
  } as IArticleChapter;
}

/**
 * update article
 */
export async function prismaUpdateArticleById(input: IUpdateArticleByIdInput): Promise<IArticle> {
  const article = await prismaClient.article.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title,
      imgUrl: input.imgUrl,
    },
  });
  return article as IArticle;
}

/**
 * update article's chapter
 */
export async function prismaUpdateArticleChapterById(input: IUpdateArticleChapterByIdInput): Promise<IArticleChapter> {
  const chapter = await prismaClient.articleChapter.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title,
      content: input.content,
      ...(input.order !== undefined ? { order: input.order } : {}),
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }
  return {
    ...chapter,
    createdAt: chapter.createdAt.toISOString(),
    updatedAt: chapter.updatedAt.toISOString(),
  } as IArticleChapter;
}

/**
 * delete article
 */
export async function prismaDeleteArticleById(input: IDeleteArticleByIdInput): Promise<IArticle> {
  const article = await prismaClient.article.delete({
    where: {
      id: input.id,
    },
  });
  return article as IArticle;
}

/**
 * delete article's chapter
 */
export async function prismaDeleteArticleChapterById(input: IDeleteArticleChapterByIdInput): Promise<IArticleChapter> {
  const chapter = await prismaClient.articleChapter.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const [deletedChapter] = await prismaClient.$transaction([
    // delete chapter
    prismaClient.articleChapter.delete({
      where: { id: input.id },
    }),
    // update article.orders
    prismaClient.article.update({
      where: { id: chapter.articleId },
      data: { orders: { decrement: 1 } },
    }),
  ]);

  if (!deletedChapter) {
    throw new Error("Failed to delete chapter");
  }
  return {
    ...deletedChapter,
    createdAt: deletedChapter.createdAt.toISOString(),
    updatedAt: deletedChapter.updatedAt.toISOString(),
  } as IArticleChapter;
}
