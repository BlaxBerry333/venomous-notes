import { z } from "zod";

import { t } from "@/server/trpc/trpc-init";
import { INoteType, type INote } from "@/types";

export const GetNoteListInputSchema = z.object({
  type: z.nativeEnum(INoteType).optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * get note list
 */
export const getNoteList = t.procedure
  .input(GetNoteListInputSchema)
  .query(async ({ input, ctx }): Promise<INote[]> => {
    try {
      const notes = await ctx.prisma.note.findMany({
        where: {
          type: input.type,
          userId: input.userId,
          createdAt: input.createdAt,
          updatedAt: input.updatedAt,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return notes;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error("failed to get note list", (error as any)?.message);
    }
  });
