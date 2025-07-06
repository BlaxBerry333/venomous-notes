import prismaClient from "@/server/db/prisma-client";
import { type IGetNoteOfStoryChaptersListInputSchema, type INoteStoryChapter } from "@/types";

/**
 * Prisma get note story characters list
 */
export async function prismaGetNoteStoryCharactersList(
  { storyId }: Partial<IGetNoteOfStoryChaptersListInputSchema>,
  pagination: { from: number; size: number },
): Promise<Array<Omit<INoteStoryChapter, "content">>> {
  try {
    const chapters = await prismaClient.noteStoryChapter.findMany({
      where: {
        storyId,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        storyId: true,
        title: true,
        order: true,
        content: false,
      },
      skip: pagination.from || 0,
      take: pagination.size || 20,
    });

    return chapters;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to get note story characters list", (error as any)?.message);
  }
}
