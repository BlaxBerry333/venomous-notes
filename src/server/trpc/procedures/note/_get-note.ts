import { z } from "zod";

import { t } from "@/server/trpc/trpc-init";
import type { INote, PrismaClient } from "@/types";

export const GetNoteInputSchema = z.object({
  id: z.string().uuid(),
});

/**
 * get note by id
 */
export const getNote = t.procedure
  .input(GetNoteInputSchema)
  .query(async ({ input, ctx }): Promise<INote> => {
    try {
      const note = await __findNoteFromDB(ctx.prisma, input.id);
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error("failed to get note", (error as any)?.message);
    }
  });

export async function __findNoteFromDB(prismaClient: PrismaClient, id: INote["id"]) {
  const note = await prismaClient.note.findUnique({
    where: { id },
  });
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
}
