"use client";

import { Button, Flex, Loading, Text } from "venomous-ui";
import { z } from "zod";

import type { CreateNoteInputSchema } from "@/server/trpc/procedures/note";
import { type INote, INoteType } from "@/types";

interface Props {
  data: undefined | INote[];
  isLoading: boolean;
  selectedMemoType: undefined | INoteType;
  createMemo: (note: z.infer<typeof CreateNoteInputSchema>) => Promise<void>;
  deleteMemo: (note: Pick<INote, "id">) => Promise<void>;
}

export default function NoteList({
  data,
  isLoading,
  selectedMemoType,
  createMemo,
  deleteMemo,
}: Props) {
  return (
    <section>
      {!!selectedMemoType && (
        <Flex row justifyContent="space-between">
          <Text text={`${selectedMemoType} ( Total: ${data?.length} )`} />
          <Button
            color="success"
            icon="solar:plus-bold-duotone"
            onClick={() =>
              createMemo({
                type: selectedMemoType,
              })
            }
            text="Create"
          />
        </Flex>
      )}

      {isLoading && <Loading />}

      {!isLoading && (
        <div>
          {data?.map((note, index) => (
            <Flex row key={note.id} gap={2}>
              <Button
                isCircle
                isGhost
                color="error"
                icon="solar:trash-bin-minimalistic-bold-duotone"
                onClick={() => deleteMemo({ id: note.id })}
              />
              <Text text={String(index + 1)} /> <Text text={note.id} />
            </Flex>
          ))}
        </div>
      )}
    </section>
  );
}
