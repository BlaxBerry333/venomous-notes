import { z } from "zod";

import type {
  NoteOfGallery as INoteOfGallery,
  NoteOfMemo as INoteOfMemo,
  NoteStoryChapter as INoteStoryChapter,
  Note,
  NoteOfStory,
} from "@/generated/prisma";
import { NoteType as INoteType } from "@/generated/prisma";

export { INoteType };
export type { INoteOfGallery, INoteOfMemo, INoteStoryChapter };

export type INote = Note & Partial<INoteOfMemo> & Partial<INoteOfStory> & Partial<INoteOfGallery>;

export type INoteOfStory = NoteOfStory & {
  chapters: Array<Pick<INoteStoryChapter, "title" | "content" | "order">>;
};

export const GetNoteListInputSchema = z.object({
  type: z.nativeEnum(INoteType).optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.date().optional().optional(),
  updatedAt: z.date().optional().optional(),
  deletedAt: z.date().optional().optional().nullable(),
});

export const GetNoteInputSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(INoteType),
});

export const CreateNoteInputSchema = z.object({
  type: z.nativeEnum(INoteType),
  message: z.string().optional(),
  imgUrls: z.array(z.string()).optional(),
  title: z.string().optional(),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        order: z.number(),
      }),
    )
    .optional(),
});

export const UpdateNoteInputSchema = CreateNoteInputSchema.extend({
  id: z.string().uuid(),
});

export const DeleteNoteInputSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(INoteType),
});

export const GetNoteOfStoryChaptersListInputSchema = z.object({
  storyId: z.string().uuid(),
});

export const GetNoteOfStoryChapterContentInputSchema = z.object({
  storyId: z.string().uuid(),
  id: z.string().uuid(),
});

export type IGetNoteListInputSchema = z.infer<typeof GetNoteListInputSchema>;
export type IGetNoteInputSchema = z.infer<typeof GetNoteInputSchema>;
export type ICreateNoteInputSchema = z.infer<typeof CreateNoteInputSchema>;
export type IUpdateNoteInputSchema = z.infer<typeof UpdateNoteInputSchema>;
export type IDeleteNoteInputSchema = z.infer<typeof DeleteNoteInputSchema>;
export type IGetNoteOfStoryChaptersListInputSchema = z.infer<
  typeof GetNoteOfStoryChaptersListInputSchema
>;
export type IGetNoteOfStoryChapterContentInputSchema = z.infer<
  typeof GetNoteOfStoryChapterContentInputSchema
>;
