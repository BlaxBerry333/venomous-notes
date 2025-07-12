import prismaClient from "@/server/db/prisma-client";
import type { IDeleteNoteOfStoryChapterInputSchema, INoteStoryChapter } from "@/types";
import { prismaGetNoteStoryChapter } from "./_get-note-story-chapter";

/**
 * Prisma delete note story chapter
 */
export async function prismaDeleteNoteStoryChapter({
  storyId,
  id,
}: IDeleteNoteOfStoryChapterInputSchema): Promise<INoteStoryChapter> {
  try {
    await prismaGetNoteStoryChapter({ storyId, id });

    const chapter = await prismaClient.noteStoryChapter.delete({
      where: { storyId, id },
    });
    return chapter;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to delete note story chapter", (error as any)?.message);
  }
}
