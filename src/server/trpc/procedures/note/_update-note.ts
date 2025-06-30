import { z } from "zod";

import { prismaUpdateNote } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { INoteType, type INote } from "@/types";

export const UpdateNoteInputSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(INoteType),
});

/**
 * TRPC procedure update note
 */
export const updateNote = t.procedure
  .use(trpcAuthMiddleware)
  .input(UpdateNoteInputSchema)
  .mutation(async ({ input }): Promise<INote> => {
    try {
      const note = await prismaUpdateNote(input);
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
