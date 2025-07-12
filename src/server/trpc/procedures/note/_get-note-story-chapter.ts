import { prismaGetNoteStoryChapter } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import { GetNoteOfStoryChapterContentInputSchema, type INoteStoryChapter } from "@/types";

/**
 * TRPC procedure get note story chapter
 */
export const getNoteStoryChapter = t.procedure
  .use(trpcAuthMiddleware)
  .input(GetNoteOfStoryChapterContentInputSchema)
  .query(async ({ input }): Promise<INoteStoryChapter> => {
    try {
      const chapters = await prismaGetNoteStoryChapter(input);
      return chapters;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
