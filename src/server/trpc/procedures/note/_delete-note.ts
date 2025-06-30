import { z } from "zod";

import { prismaDeleteNote } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import type { INote } from "@/types";

export const DeleteNoteInputSchema = z.object({
  id: z.string().uuid(),
});

/**
 * TRPC procedure delete note by id
 */
export const deleteNote = t.procedure
  .use(trpcAuthMiddleware)
  .input(DeleteNoteInputSchema)
  .mutation(async ({ input }): Promise<INote> => {
    try {
      const note = await prismaDeleteNote(input.id);
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
