import { z } from "zod";

import { prismaGetNoteList } from "@/server/db/crud-apis/note";
import { t } from "@/server/trpc/trpc-init";
import { INoteType, type INote } from "@/types";

export const GetNoteListInputSchema = z.object({
  type: z.nativeEnum(INoteType).optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * TRPC procedure get note list
 */
export const getNoteList = t.procedure
  .input(GetNoteListInputSchema)
  .query(async ({ input }): Promise<INote[]> => {
    try {
      const notes = await prismaGetNoteList(input, { from: 0, size: 20 });
      return notes;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
