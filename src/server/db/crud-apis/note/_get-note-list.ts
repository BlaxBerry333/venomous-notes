import prismaClient from "@/server/db/prisma-client";
import { INoteType, type IGetNoteListInputSchema, type INote, type INoteOfStory } from "@/types";

/**
 * Prisma get note list
 */
export async function prismaGetNoteList(
  filterData: Partial<IGetNoteListInputSchema>,
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
        gallery: filterData.type === INoteType.GALLERY,
        story: filterData.type === INoteType.STORY && {
          include: {
            chapters: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: pagination.from || 0,
      take: pagination.size || 20,
    });

    return notes.map((_n) => {
      const { memo, story, gallery, ...rest } = _n;
      console.log(_n);

      switch (rest.type) {
        case INoteType.MEMO:
          return {
            ...rest,
            message:
              (memo?.message || "")?.length > 140
                ? `${memo?.message?.slice(0, 140)}...`
                : memo?.message,
          }; // FIXME: Raw SQL
        case INoteType.STORY:
          return { ...rest, title: story?.title, chapters: (story as INoteOfStory)?.chapters };
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
