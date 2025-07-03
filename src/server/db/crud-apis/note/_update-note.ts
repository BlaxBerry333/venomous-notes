import prismaClient from "@/server/db/prisma-client";
import { INoteType, type INote } from "@/types";
import { prismaGetNote } from "./_get-note";

type IPrismaUpdateNoteParams = Omit<INote, "userId" | "createdAt" | "updatedAt" | "deletedAt">;

/**
 * Prisma update note
 */
export async function prismaUpdateNote(params: IPrismaUpdateNoteParams): Promise<INote> {
  try {
    console.log(params);

    const { id, type, ...rest } = params;

    await prismaGetNote(id);

    const note = await prismaClient.note.update({
      where: { id },
      data: {
        type,
        ...(type === INoteType.MEMO
          ? {
              memo: {
                update: {
                  message: rest.message,
                },
              },
            }
          : {}),

        ...(type === INoteType.GALLERY
          ? {
              gallery: {
                update: {
                  imgUrls: rest.imgUrls,
                },
              },
            }
          : {}),
      },
    });
    return note;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error("failed to update note", (error as any)?.message);
  }
}
