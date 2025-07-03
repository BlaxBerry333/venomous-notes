import { prismaGetNoteList } from "@/server/db/crud-apis/note";
import { t } from "@/server/trpc/trpc-init";
import { GetNoteListInputSchema, type INote } from "@/types";

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
