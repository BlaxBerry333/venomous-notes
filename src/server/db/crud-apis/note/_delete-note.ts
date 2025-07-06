import prismaClient from "@/server/db/prisma-client";
import type { IDeleteNoteInputSchema, INote } from "@/types";
import { prismaGetNote } from "./_get-note";

/**
 * Prisma delete note by id
 */
export async function prismaDeleteNote({ id, type }: IDeleteNoteInputSchema): Promise<INote> {
  try {
    await prismaGetNote({ id, type });

    const note = await prismaClient.note.delete({
      where: { id },
    });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to delete note", (error as any)?.message);
  }
}
