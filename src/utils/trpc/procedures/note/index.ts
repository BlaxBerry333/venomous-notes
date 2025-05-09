import { checkAuthenticationMiddleware } from "@/utils/trpc/middlewares";
import { t } from "@/utils/trpc/trpc-init";

import { MOCK_NOTE_LIST } from "./mock";
import {
  NoteCreateInputSchema,
  NoteDeleteInputSchema,
  NoteListQueryInputSchema,
  NoteQueryInputSchema,
  NoteUpdateInputSchema,
  type INote,
} from "./schema";

export const getNoteList = t.procedure
  .input(NoteListQueryInputSchema)
  .query(async ({ input }): Promise<INote[]> => {
    //   const notes = await ctx.prisma.note.findMany({
    //     orderBy: {
    //       createdAt: 'desc',
    //     },
    //   });
    //   return notes.map((note) => ({
    //     id: note.id,
    //     title: note.title,
    //     createdAt: note.createdAt,
    //   }));

    return MOCK_NOTE_LIST.filter((note) => note.type === input.type);
  });

export const getNoteById = t.procedure
  .input(NoteQueryInputSchema)
  .query(async ({ input }): Promise<INote> => {
    //   const notes = await ctx.prisma.note.findMany({
    //     orderBy: {
    //       createdAt: 'desc',
    //     },
    //   });
    //   return notes.map((note) => ({
    //     id: note.id,
    //     title: note.title,
    //     createdAt: note.createdAt,
    //   }));

    const note = MOCK_NOTE_LIST.find((note) => note.id === input.id);
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  });

export const createNote = t.procedure
  .use(checkAuthenticationMiddleware)
  .input(NoteCreateInputSchema)
  .mutation(async ({ input }): Promise<INote> => {
    //   const notes = await ctx.prisma.note.findMany({
    //     orderBy: {
    //       createdAt: 'desc',
    //     },
    //   });
    //   return notes.map((note) => ({
    //     id: note.id,
    //     title: note.title,
    //     createdAt: note.createdAt,
    //   }));

    const note = {
      id: new Date().toString(),
      type: input.type,
      title: input.title,
      createdAt: new Date().toString(),
    };

    MOCK_NOTE_LIST.push(note);
    return note;
  });

export const updateNote = t.procedure
  .use(checkAuthenticationMiddleware)
  .input(NoteUpdateInputSchema)
  .mutation(async ({ input }): Promise<INote> => {
    //   const notes = await ctx.prisma.note.findMany({
    //     orderBy: {
    //       createdAt: 'desc',
    //     },
    //   });
    //   return notes.map((note) => ({
    //     id: note.id,
    //     title: note.title,
    //     createdAt: note.createdAt,
    //   }));
    const note = MOCK_NOTE_LIST.find((note) => note.id === input.id);
    if (!note) {
      throw new Error("Note not found");
    }
    note.type = input.type;
    note.title = input.title;
    return note;
  });

export const deleteNote = t.procedure
  .use(checkAuthenticationMiddleware)
  .input(NoteDeleteInputSchema)
  .mutation(async ({ input }): Promise<INote> => {
    //   const notes = await ctx.prisma.note.findMany({
    //     orderBy: {
    //       createdAt: 'desc',
    //     },
    //   });
    //   return notes.map((note) => ({
    //     id: note.id,
    //     title: note.title,
    //     createdAt: note.createdAt,
    //   }));
    const note = MOCK_NOTE_LIST.find((note) => note.id === input.id);
    if (!note) {
      throw new Error("Note not found");
    }
    MOCK_NOTE_LIST.splice(MOCK_NOTE_LIST.indexOf(note), 1);
    return note;
  });
