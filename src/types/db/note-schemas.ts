import { z } from "zod";

import { NoteType as INoteType } from "@/generated/prisma";

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
