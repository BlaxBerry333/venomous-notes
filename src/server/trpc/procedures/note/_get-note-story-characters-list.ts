import { prismaGetNoteStoryCharactersList } from "@/server/db/crud-apis/note";
import { trpcAuthMiddleware } from "@/server/trpc/middlewares";
import { t } from "@/server/trpc/trpc-init";
import {
  GetNoteOfStoryChaptersListInputSchema,
  type IGetNoteOfStoryChaptersListResponse,
} from "@/types";

/**
 * TRPC procedure get note story characters list
 */
export const getNoteStoryCharactersList = t.procedure
  .use(trpcAuthMiddleware)
  .input(GetNoteOfStoryChaptersListInputSchema)
  .query(async ({ input }): Promise<IGetNoteOfStoryChaptersListResponse> => {
    try {
      const chapters = await prismaGetNoteStoryCharactersList(input, { from: 0, size: 20 });
      return chapters;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any)?.message);
    }
  });
