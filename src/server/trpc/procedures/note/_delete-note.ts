import { z } from "zod";

import { checkAuthenticationMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import type { INote } from "@/types";
import { __findNoteFromDB } from "./_get-note";

export const DeleteNoteInputSchema = z.object({
  id: z.string().uuid(),
});

/**
 * delete note by id
 */
export const deleteNote = t.procedure
  .use(checkAuthenticationMiddleware)
  .input(DeleteNoteInputSchema)
  .mutation(async ({ input, ctx }): Promise<INote> => {
    try {
      await __findNoteFromDB(ctx.prisma, input.id);

      const note = ctx.prisma.note.delete({
        where: { id: input.id },
      });
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error("failed to delete note", (error as any)?.message);
    }
  });
