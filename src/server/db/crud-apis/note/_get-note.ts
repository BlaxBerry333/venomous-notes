import prismaClient from "@/server/db/prisma-client";
import type { INote } from "@/types";

/**
 * Prisma get note by id
 */
export async function prismaGetNote(id: INote["id"]): Promise<INote> {
  try {
    const note = await prismaClient.note.findUnique({
      where: { id },
      include: {
        memo: true,
        gallery: true,
        story: true,
      },
    });
    if (!note) {
      throw new Error(`failed to found note #${id}`);
    }
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to get note", (error as any)?.message);
  }
}
