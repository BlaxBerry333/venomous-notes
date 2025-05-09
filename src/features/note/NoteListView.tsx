"use client";

import { NoteTypeEnum, type INote } from "@/utils/trpc/procedures/note/schema";

import { Button, Flex, Loading, Radios, Text } from "venomous-ui";

interface NoteListViewProps {
  data: undefined | INote[];
  isLoading: boolean;
  selectedNoteType: NoteTypeEnum;
  setSelectedNoteType: (noteType: NoteTypeEnum) => void;
  createNote: (note: Pick<INote, "type" | "title">) => Promise<void>;
  deleteNote: (note: Pick<INote, "id">) => Promise<void>;
}

export default function NoteListView({
  data,
  isLoading,
  selectedNoteType,
  setSelectedNoteType,
  createNote,
  deleteNote,
}: NoteListViewProps) {
  return (
    <section>
      <Text isTitle titleLevel="h4" text="NotePage" />

      <Button
        color="success"
        icon="solar:plus-bold-duotone"
        onClick={() => createNote({ type: selectedNoteType, title: "New Note" })}
        text="Create"
      />

      <Radios
        label="Toggle Note Type"
        name="type"
        value={selectedNoteType}
        options={[
          { label: "Draft", value: NoteTypeEnum.Draft },
          { label: "Language", value: NoteTypeEnum.Language },
        ]}
        onChange={(value) => setSelectedNoteType(value.value as NoteTypeEnum)}
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
                onClick={() => deleteNote({ id: note.id })}
              />
            </Flex>
          ))}
        </div>
      )}
    </section>
  );
}
