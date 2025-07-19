import z from "zod";

const articleFields = {
  id: z.uuid(),
  title: z.string().min(1),
  userId: z.uuid(),
  imgUrl: z.string().optional(),
};

const articleChapterFields = {
  id: z.string().uuid(),
  title: z.string().min(1),
  articleId: z.uuid(),
  content: z.string().min(1),
  order: z.number(),
};

export const articleZodSchemas = {
  GetArticleListByUserId: z.object({}).extend({
    userId: articleFields.userId,
  }),

  GetArticleByIdInput: z.object({}).extend({
    id: articleFields.id,
  }),

  GetArticleChapterListByArticleIdInput: z.object({}).extend({
    articleId: articleChapterFields.id,
  }),

  GetArticleChapterByOrderInput: z.object({}).extend({
    articleId: articleChapterFields.id,
    order: articleChapterFields.order,
  }),

  CreateArticleByUserIdInput: z.object({}).extend({
    title: articleFields.title,
    imgUrl: articleFields.imgUrl,
  }),

  CreateArticleChapterByArticleIdInput: z.object({}).extend({
    articleId: articleChapterFields.articleId,
    title: articleChapterFields.title,
    content: articleChapterFields.content,
  }),

  UpdateArticleByIdInput: z.object({}).extend({
    id: articleFields.id,
    title: articleFields.title,
    imgUrl: articleFields.imgUrl,
  }),

  UpdateArticleChapterByIdInput: z.object({}).extend({
    id: articleChapterFields.id,
    title: articleChapterFields.title,
    content: articleChapterFields.content,
    order: articleChapterFields.order.optional(),
  }),

  DeleteArticleByIdInput: z.object({}).extend({
    id: articleFields.id,
  }),

  DeleteArticleChapterByIdInput: z.object({}).extend({
    id: articleChapterFields.id,
  }),
};

export type IGetArticleListByUserId = z.infer<typeof articleZodSchemas.GetArticleListByUserId>;
export type IGetArticleByIdInput = z.infer<typeof articleZodSchemas.GetArticleByIdInput>;
export type IGetArticleChapterListByArticleIdInput = z.infer<typeof articleZodSchemas.GetArticleChapterListByArticleIdInput>;
export type IGetArticleChapterByOrderInput = z.infer<typeof articleZodSchemas.GetArticleChapterByOrderInput>;
export type ICreateArticleByUserIdInput = z.infer<typeof articleZodSchemas.CreateArticleByUserIdInput>;
export type ICreateArticleChapterByArticleIdInput = z.infer<typeof articleZodSchemas.CreateArticleChapterByArticleIdInput>;
export type IUpdateArticleByIdInput = z.infer<typeof articleZodSchemas.UpdateArticleByIdInput>;
export type IUpdateArticleChapterByIdInput = z.infer<typeof articleZodSchemas.UpdateArticleChapterByIdInput>;
export type IDeleteArticleByIdInput = z.infer<typeof articleZodSchemas.DeleteArticleByIdInput>;
export type IDeleteArticleChapterByIdInput = z.infer<typeof articleZodSchemas.DeleteArticleChapterByIdInput>;
