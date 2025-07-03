import { prismaCreateNote } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { CreateNoteInputSchema, type INote } from "@/types";

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
