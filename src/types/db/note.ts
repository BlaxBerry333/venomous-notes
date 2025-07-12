import type {
  NoteOfGallery as INoteOfGallery,
  NoteOfMemo as INoteOfMemo,
  NoteStoryChapter as INoteStoryChapter,
  Note,
  NoteOfStory,
} from "@/generated/prisma";
import { NoteType as INoteType } from "@/generated/prisma";
import type z from "zod";

import {
  CreateNoteInputSchema,
  CreateNoteOfStoryChapterInputSchema,
  DeleteNoteInputSchema,
  DeleteNoteOfStoryChapterInputSchema,
  GetNoteInputSchema,
  GetNoteListInputSchema,
  GetNoteOfStoryChapterContentInputSchema,
  GetNoteOfStoryChaptersListInputSchema,
  UpdateNoteInputSchema,
  UpdateNoteOfStoryChapterInputSchema,
} from "./note-schemas";

export { INoteType };
export type { INoteOfGallery, INoteOfMemo, INoteStoryChapter };

export type INote = Note & Partial<INoteOfMemo> & Partial<INoteOfStory> & Partial<INoteOfGallery>;

export type INoteOfStory = NoteOfStory & {
  chapters: Array<Pick<INoteStoryChapter, "title" | "content" | "order">>;
};

export type IGetNoteListInputSchema = z.infer<typeof GetNoteListInputSchema>;

export type IGetNoteInputSchema = z.infer<typeof GetNoteInputSchema>;

export type IGetNoteOfStoryChaptersListInputSchema = z.infer<
  typeof GetNoteOfStoryChaptersListInputSchema
>;

export type IGetNoteOfStoryChapterContentInputSchema = z.infer<
  typeof GetNoteOfStoryChapterContentInputSchema
>;

export type IGetNoteOfStoryChaptersListResponse = Array<Omit<INoteStoryChapter, "content">>;

export type ICreateNoteInputSchema = z.infer<typeof CreateNoteInputSchema>;

export type ICreateNoteOfStoryChapterInputSchema = z.infer<
  typeof CreateNoteOfStoryChapterInputSchema
>;

export type IUpdateNoteInputSchema = z.infer<typeof UpdateNoteInputSchema>;

export type IUpdateNoteOfStoryChapterInputSchema = z.infer<
  typeof UpdateNoteOfStoryChapterInputSchema
>;

export type IDeleteNoteInputSchema = z.infer<typeof DeleteNoteInputSchema>;

export type IDeleteNoteOfStoryChapterInputSchema = z.infer<
  typeof DeleteNoteOfStoryChapterInputSchema
>;
