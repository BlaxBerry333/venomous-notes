import { prismaGetNote } from "@/server/db/crud-apis/note";
import { t } from "@/server/trpc/trpc-init";
import { GetNoteInputSchema, type INote } from "@/types";

/**
 * TRPC procedure get note by id
 */
export const getNote = t.procedure
  .input(GetNoteInputSchema)
  .query(async ({ input }): Promise<INote> => {
    try {
      const note = await prismaGetNote(input.id);
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
