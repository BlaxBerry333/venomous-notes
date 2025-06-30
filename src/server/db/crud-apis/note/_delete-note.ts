import prismaClient from "@/server/db/prisma-client";
import type { INote } from "@/types";
import { prismaGetNote } from "./_get-note";

/**
 * Prisma delete note by id
 */
export async function prismaDeleteNote(id: INote["id"]): Promise<INote> {
  try {
    await prismaGetNote(id);

    const note = await prismaClient.note.delete({
      where: { id },
    });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to delete note", (error as any)?.message);
  }
}
