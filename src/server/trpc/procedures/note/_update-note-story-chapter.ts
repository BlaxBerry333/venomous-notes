import { prismaUpdateNoteStoryChapter } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { UpdateNoteOfStoryChapterInputSchema, type INoteStoryChapter } from "@/types";

/**
 * TRPC procedure update note story chapter
 */
export const updateNoteStoryChapter = t.procedure
  .use(trpcAuthMiddleware)
  .input(UpdateNoteOfStoryChapterInputSchema)
  .mutation(async ({ input }): Promise<INoteStoryChapter> => {
    try {
      const chapter = await prismaUpdateNoteStoryChapter(input);
      return chapter;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
