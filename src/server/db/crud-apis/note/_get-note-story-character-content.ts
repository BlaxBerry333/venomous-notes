import prismaClient from "@/server/db/prisma-client";
import { type IGetNoteOfStoryChapterContentInputSchema, type INoteStoryChapter } from "@/types";

/**
 * Prisma get note story character content
 */
export async function prismaGetNoteStoryCharacterContent({
  storyId,
  id,
}: Partial<IGetNoteOfStoryChapterContentInputSchema>): Promise<INoteStoryChapter> {
  try {
    const chapterContent = await prismaClient.noteStoryChapter.findUnique({
      where: {
        storyId,
        id,
      },
    });

    if (!chapterContent) {
      throw new Error(`failed to found content of chapter #${id} of story #${storyId}`);
    }

    return chapterContent;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to get note story characters content", (error as any)?.message);
  }
}
