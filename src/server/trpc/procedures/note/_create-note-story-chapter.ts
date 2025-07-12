import { prismaCreateNoteStoryChapter } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { CreateNoteOfStoryChapterInputSchema, type INoteStoryChapter } from "@/types";

/**
 * TRPC procedure create note story chapter
 */
export const createNoteStoryChapter = t.procedure
  .use(trpcAuthMiddleware)
  .input(CreateNoteOfStoryChapterInputSchema)
  .mutation(async ({ input }): Promise<INoteStoryChapter> => {
    try {
      const chapter = await prismaCreateNoteStoryChapter({
        storyId: input.storyId,
        title: input.title,
        content: input.content,
      });
      return chapter;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
