import prismaClient from "@/server/db/prisma-client";
import { type INoteStoryChapter, type IUpdateNoteOfStoryChapterInputSchema } from "@/types";
import { prismaGetNoteStoryChapter } from "./_get-note-story-chapter";

/**
 * Prisma update note story chapter
 */
export async function prismaUpdateNoteStoryChapter({
  storyId,
  id,
  title,
  content,
}: IUpdateNoteOfStoryChapterInputSchema): Promise<INoteStoryChapter> {
  try {
    await prismaGetNoteStoryChapter({ storyId, id });

    const note = await prismaClient.noteStoryChapter.update({
      where: { storyId, id },
      data: {
        title,
        content,
      },
    });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to update note story chapter content", (error as any)?.message);
  }
}
