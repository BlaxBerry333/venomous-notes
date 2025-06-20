"use client";

import { useState } from "react";

import { Text } from "venomous-ui";

import MemoListView from "@/client/features/memo/MemoList";
import { useCreateNote, useDeleteNote, useGetNoteList } from "@/client/hooks/fetch-note";
import { NoteTypeEnum } from "@/server/trpc/procedures/note/schema";

export default function NotePage() {
  const [selectedNoteType, setSelectedNoteType] = useState<NoteTypeEnum>(NoteTypeEnum.Draft);

  const { data, isLoading } = useGetNoteList({ type: selectedNoteType });
  const { mutateAsync: createNote } = useCreateNote();
  // const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  return (
    <>
      <Text isTitle titleLevel="h5" text="Memo Page" />

      <MemoListView
        data={data}
        isLoading={isLoading}
        selectedMemoType={selectedNoteType}
        setSelectedMemoType={setSelectedNoteType}
        createMemo={async (note) => {
          await createNote(note);
        }}
        deleteMemo={async (note) => {
          await deleteNote(note);
        }}
      />
    </>
  );
}
