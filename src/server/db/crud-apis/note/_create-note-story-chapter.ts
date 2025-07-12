import prismaClient from "@/server/db/prisma-client";
import { type ICreateNoteOfStoryChapterInputSchema, type INoteStoryChapter } from "@/types";

/**
 * Prisma create note story chapter
 */
export async function prismaCreateNoteStoryChapter({
  storyId,
  title,
  content,
}: ICreateNoteOfStoryChapterInputSchema): Promise<INoteStoryChapter> {
  try {
    const maxOrder = await prismaClient.noteStoryChapter.aggregate({
      where: { storyId },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const note = await prismaClient.noteStoryChapter.create({
      data: {
        storyId,
        title,
        content,
        order: nextOrder,
      },
    });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to update note story chapter content", (error as any)?.message);
  }
}
