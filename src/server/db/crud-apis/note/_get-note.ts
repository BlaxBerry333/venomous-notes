import prismaClient from "@/server/db/prisma-client";
import { INoteType, type IGetNoteInputSchema, type INote } from "@/types";

/**
 * Prisma get note by id
 */
export async function prismaGetNote({ id, type }: IGetNoteInputSchema): Promise<INote> {
  try {
    const note = await prismaClient.note.findUnique({
      where: { id },
      include: {
        memo: type === INoteType.MEMO,
        gallery: type === INoteType.GALLERY,
        story: type === INoteType.STORY,
      },
    });

    if (!note) {
      throw new Error(`failed to found note #${id}`);
    }

    const { memo, story, gallery, ...rest } = note;
    switch (rest.type) {
      case INoteType.MEMO:
        return { ...rest, message: memo?.message };
      case INoteType.STORY:
        return { ...rest, title: story?.title };
      case INoteType.GALLERY:
        return { ...rest, imgUrls: gallery?.imgUrls };
      default:
        return rest;
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to get note", (error as any)?.message);
  }
}
