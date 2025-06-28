"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Text } from "venomous-ui";

import NoteList from "@/client/features/note/components/NoteList";
import {
  useCreateNote,
  useDeleteNote,
  useGetNoteList,
} from "@/client/features/note/hooks/fetch-note";

import { INoteType, type INote } from "@/types";

export default function NoteListPage() {
  const searchParams = useSearchParams();
  const noteType = useMemo<INoteType | undefined>(
    () => (searchParams.get("type") as INoteType) || undefined,
    [searchParams],
  );
  const isSupportedNoteType = useMemo<boolean>(
    () => !!noteType && Object.values(INoteType).includes(noteType),
    [noteType],
  );

  const { data, isLoading, error } = useGetNoteList({
    type: noteType,
  });
  console.log({ data, isLoading, error });

  const { mutateAsync: createNote } = useCreateNote();
  // const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  if (!isSupportedNoteType) {
    return <Text text="InValid NoteType" />;
  }

  return (
    <>
      <Text isTitle text="Note List Page" />

      <NoteList
        data={data as unknown as INote[]}
        isLoading={isLoading}
        selectedMemoType={noteType}
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
