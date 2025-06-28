import { z } from "zod";

import { t } from "@/server/trpc/trpc-init";
import { INoteType, type INote } from "@/types";

export const CreateNoteInputSchema = z.object({
  type: z.nativeEnum(INoteType),
});

/**
 * create note
 */
export const createNote = t.procedure
  .input(CreateNoteInputSchema)
  .mutation(async ({ input, ctx }): Promise<INote> => {
    try {
      const note = ctx.prisma.note.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error("failed to create note", (error as any)?.message);
    }
  });
