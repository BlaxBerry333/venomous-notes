import prismaClient from "@/server/db/prisma-client";
import type { INote } from "@/types";

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
      orderBy: {
        createdAt: "desc",
      },
      skip: pagination.from || 0,
      take: pagination.size || 20,
    });
    return notes as INote[];
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to get note list", (error as any)?.message);
  }
}
