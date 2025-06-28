import { z } from "zod";

import { checkAuthenticationMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { INoteType, type INote } from "@/types";
import { __findNoteFromDB } from "./_get-note";

export const UpdateNoteInputSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(INoteType),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * update note
 */
export const updateNote = t.procedure
  .use(checkAuthenticationMiddleware)
  .input(UpdateNoteInputSchema)
  .mutation(async ({ input, ctx }): Promise<INote> => {
    try {
      await __findNoteFromDB(ctx.prisma, input.id);

      const note = ctx.prisma.note.update({
        where: { id: input.id },
        data: input,
      });
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error("failed to update note", (error as any)?.message);
    }
  });
