"use client";

import { NoteTypeEnum, type INote } from "@/utils/trpc/procedures/note/schema";

import { Button, Flex, Loading, Radios, Text } from "venomous-ui";

interface Props {
  data: undefined | INote[];
  isLoading: boolean;
  selectedMemoType: NoteTypeEnum;
  setSelectedMemoType: (noteType: NoteTypeEnum) => void;
  createMemo: (note: Pick<INote, "type" | "title">) => Promise<void>;
  deleteMemo: (note: Pick<INote, "id">) => Promise<void>;
}

export default function MemoList({
  data,
  isLoading,
  selectedMemoType,
  setSelectedMemoType,
  createMemo,
  deleteMemo,
}: Props) {
  return (
    <section>
      <Button
        color="success"
        icon="solar:plus-bold-duotone"
        onClick={() => createMemo({ type: selectedMemoType, title: "New Memo" })}
        text="Create"
      />

      <Radios
        label="Toggle Note Type"
        name="type"
        value={selectedMemoType}
        options={[
          { label: "Draft", value: NoteTypeEnum.Draft },
          { label: "Language", value: NoteTypeEnum.Language },
        ]}
        onChange={(value) => setSelectedMemoType(value.value as NoteTypeEnum)}
      />

      {isLoading && <Loading />}

      {!isLoading && (
        <div>
          {data?.map((note) => (
            <Flex row key={note.id} gap={2}>
              <Text text={note.title} />
              <Button
                isCircle
                isGhost
                color="error"
                icon="solar:trash-bin-minimalistic-bold-duotone"
                onClick={() => deleteMemo({ id: note.id })}
              />
            </Flex>
          ))}
        </div>
      )}
    </section>
  );
}
