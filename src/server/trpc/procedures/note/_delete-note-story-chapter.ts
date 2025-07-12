import { prismaDeleteNoteStoryChapter } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { DeleteNoteOfStoryChapterInputSchema, type INoteStoryChapter } from "@/types";

/**
 * TRPC procedure delete note story chapter
 */
export const deleteNoteStoryChapter = t.procedure
  .use(trpcAuthMiddleware)
  .input(DeleteNoteOfStoryChapterInputSchema)
  .mutation(async ({ input }): Promise<INoteStoryChapter> => {
    try {
      const chapter = await prismaDeleteNoteStoryChapter({
        storyId: input.storyId,
        id: input.id,
      });
      return chapter;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
