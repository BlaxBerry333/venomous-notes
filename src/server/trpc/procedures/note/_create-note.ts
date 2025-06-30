import { z } from "zod";

import { prismaCreateNote } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { INoteType, type INote } from "@/types";

export const CreateNoteInputSchema = z.object({
  type: z.nativeEnum(INoteType),

  message: z.string().optional(),

  imgUrls: z.array(z.string()).optional(),

  title: z.string().optional(),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        order: z.number(),
      }),
    )
    .optional(),
});

/**
 * TRPC procedure create note
 */
export const createNote = t.procedure
  .use(trpcAuthMiddleware)
  .input(CreateNoteInputSchema)
  .mutation(async ({ input, ctx }): Promise<INote> => {
    try {
      const note = await prismaCreateNote({
        type: input.type,
        userId: ctx.account.id,
        message: input.message,
        imgUrls: input.imgUrls,
        title: input.title,
        chapters: input.chapters,
      });
      return note;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
