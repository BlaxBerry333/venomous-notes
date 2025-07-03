import prismaClient from "@/server/db/prisma-client";
import { INoteType, type INote } from "@/types";

/**
 * Prisma get note list
 */
export async function prismaGetNoteList(
  filterData: Partial<INote>,
  pagination: { from: number; size: number },
): Promise<INote[]> {
  try {
    const notes = await prismaClient.note.findMany({
      where: {
        type: filterData.type,
        userId: filterData.userId,
        createdAt: filterData.createdAt,
        updatedAt: filterData.updatedAt,
        deletedAt: filterData.deletedAt,
      },
      include: {
        memo: filterData.type === INoteType.MEMO,
        story: filterData.type === INoteType.STORY,
        gallery: filterData.type === INoteType.GALLERY,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: pagination.from || 0,
      take: pagination.size || 20,
    });

    return notes.map((_n) => {
      const { memo, story, gallery, ...rest } = _n;
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
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to get note list", (error as any)?.message);
  }
}
