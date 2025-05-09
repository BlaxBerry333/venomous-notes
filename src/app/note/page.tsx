"use client";

import { useState } from "react";

import NoteListView from "@/features/note/NoteListView";
import { useCreateNote, useDeleteNote, useGetNoteList } from "@/hooks/fetch-note";
import { NoteTypeEnum } from "@/utils/trpc/procedures/note/schema";

export default function NotePage() {
  const [selectedNoteType, setSelectedNoteType] = useState<NoteTypeEnum>(NoteTypeEnum.Draft);

  const { data, isLoading } = useGetNoteList({ type: selectedNoteType });
  const { mutateAsync: createNote } = useCreateNote();
  // const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  return (
    <NoteListView
      data={data}
      isLoading={isLoading}
      selectedNoteType={selectedNoteType}
      setSelectedNoteType={setSelectedNoteType}
      createNote={async (note) => {
        await createNote(note);
      }}
      deleteNote={async (note) => {
        await deleteNote(note);
      }}
    />
  );
}
