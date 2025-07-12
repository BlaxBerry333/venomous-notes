import prismaClient from "@/server/db/prisma-client";
import {
  INoteType,
  Prisma,
  type ICreateNoteInputSchema,
  type INote,
  type INoteOfGallery,
  type INoteOfMemo,
  type INoteOfStory,
} from "@/types";

/**
 * Prisma create note
 */
export async function prismaCreateNote(
  params: ICreateNoteInputSchema & { userId: INote["userId"] },
): Promise<INote> {
  try {
    const note = await prismaClient.$transaction(async (transactionClient) => {
      const result = await transactionClient.note.create({
        data: {
          type: params.type,
          userId: params.userId,
        },
      });

      let noteOfMemo: Partial<INoteOfMemo> = {};
      if (params.type === INoteType.MEMO) {
        noteOfMemo = await prismaCreateNoteOfMemo(transactionClient, {
          id: result.id,
          message: params.message || "",
        });
      }
      let noteOfGallery: Partial<INoteOfGallery> = {};
      if (params.type === INoteType.GALLERY) {
        noteOfGallery = await prismaCreateNoteOfGallery(transactionClient, {
          id: result.id,
          imgUrls: params.imgUrls || [],
        });
      }
      let noteStroy: Partial<INoteOfStory> = {};
      if (params.type === INoteType.STORY) {
        noteStroy = await prismaCreateNoteOfStory(transactionClient, {
          id: result.id,
          title: params.title || "",
          chapters: params.chapters || [],
          imgUrl: "",
        });
      }

      return {
        ...result,
        ...noteOfMemo,
        ...noteOfGallery,
        ...noteStroy,
      };
    });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(`failed to create note: ${(error as any)?.message}`);
  }
}

/**
 * Prisma create note of memo type
 */
async function prismaCreateNoteOfMemo(
  client: Prisma.TransactionClient,
  data: INoteOfMemo,
): Promise<INoteOfMemo> {
  try {
    const note = await client.noteOfMemo.create({ data });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(`failed to create note of 'memo' type: ${(error as any)?.message}`);
  }
}

/**
 * Prisma create note of gallery type
 */
async function prismaCreateNoteOfGallery(
  client: Prisma.TransactionClient,
  data: INoteOfGallery,
): Promise<INoteOfGallery> {
  try {
    const note = await client.noteOfGallery.create({ data });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(`failed to create note of 'gallery' type: ${(error as any)?.message}`);
  }
}

/**
 * Prisma create note of story type
 */
async function prismaCreateNoteOfStory(
  client: Prisma.TransactionClient,
  data: INoteOfStory,
): Promise<INoteOfStory> {
  try {
    const story = await client.noteOfStory.create({
      data: {
        id: data.id,
        title: data.title,
        imgUrl: data.imgUrl,
      },
    });
    const chapters = await Promise.all(
      data.chapters.map((chapter) =>
        client.noteStoryChapter.create({
          data: {
            ...chapter,
            storyId: story.id,
          },
        }),
      ),
    );
    return {
      ...story,
      chapters,
    };
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(`failed to create note of 'story' type: ${(error as any)?.message}`);
  }
}
