import { z } from "zod";

export enum NoteTypeEnum {
  Draft = "Draft",
  Language = "language",
}

export const NoteSchema = z.object({
  id: z.string().ulid(),
  type: z.nativeEnum(NoteTypeEnum),
  title: z.string(),
  createdAt: z.string(),
});

export const NoteListQueryInputSchema = z.object({
  type: z.nativeEnum(NoteTypeEnum),
});

export const NoteQueryInputSchema = z.object({
  id: z.string().ulid(),
});

export const NoteCreateInputSchema = z.object({
  type: z.nativeEnum(NoteTypeEnum),
  title: z.string(),
});

export const NoteUpdateInputSchema = z.object({
  id: z.string().ulid(),
  type: z.nativeEnum(NoteTypeEnum),
  title: z.string(),
});

export const NoteDeleteInputSchema = z.object({
  id: z.string().ulid(),
});

export type INote = z.infer<typeof NoteSchema>;
export type INoteListQueryInput = z.infer<typeof NoteListQueryInputSchema>;
export type INoteQueryInput = z.infer<typeof NoteQueryInputSchema>;
export type INoteCreateInput = z.infer<typeof NoteCreateInputSchema>;
export type INoteUpdateInput = z.infer<typeof NoteUpdateInputSchema>;
export type NoteDeleteInput = z.infer<typeof NoteDeleteInputSchema>;
