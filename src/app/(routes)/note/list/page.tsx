"use client";

import { useSearchParams } from "next/navigation";
import { lazy, Suspense } from "react";
import { Loading, Text } from "venomous-ui";

import { NoteListContext } from "@/client/features/note/contexts/NoteListContext";
import { useGetNoteList } from "@/client/features/note/hooks";
import { INoteType, type INote } from "@/types";

const NoteOfMemoListView = lazy(() => import("@/client/features/note/views/NoteOfMemoListView"));
const NoteOfStoryListView = lazy(() => import("@/client/features/note/views/NoteOfStoryListView"));
const NoteOfGalleryListView = lazy(
  () => import("@/client/features/note/views/NoteOfGalleryListView"),
);

export default function NoteListPage() {
  const searchParams = useSearchParams();
  const noteType = searchParams.get("type") as INoteType | undefined;
  const isSupportedNoteType = noteType && Object.values(INoteType).includes(noteType);

  const { data, isLoading, error } = useGetNoteList({
    type: noteType,
  });

  if (!isSupportedNoteType) {
    return <Text text="InValid NoteType" />;
  }

  if (error) {
    return <Text text={`Error: ${error.message}`} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NoteListContext value={{ dataSource: (data || []) as unknown as INote[] }}>
      <Suspense fallback={<Loading />}>
        {noteType === INoteType.MEMO && <NoteOfMemoListView />}
        {noteType === INoteType.STORY && <NoteOfStoryListView />}
        {noteType === INoteType.GALLERY && <NoteOfGalleryListView />}
      </Suspense>

      {data?.length === 0 && <Text text="No Note" isTitle />}

      {/* <NoteList
        data={data as unknown as INote[]}
        isLoading={isLoading}
        selectedMemoType={noteType}
        createMemo={async (note) => {
          await createNote(note);
        }}
        deleteMemo={async (note) => {
          await deleteNote(note);
        }}
      /> */}
    </NoteListContext>
  );
}
