"use client";

import { notFound } from "next/navigation";
import { lazy, Suspense, use } from "react";
import { Loading, Text } from "venomous-ui";

import { NoteListContext } from "@/client/features/note/contexts/NoteListContext";
import { useGetNoteList } from "@/client/features/note/hooks";
import { INoteType } from "@/types";

const NoteOfMemoListView = lazy(() => import("@/client/features/note/views/NoteOfMemoListView"));
const NoteOfStoryListView = lazy(() => import("@/client/features/note/views/NoteOfStoryListView"));
const NoteOfGalleryListView = lazy(
  () => import("@/client/features/note/views/NoteOfGalleryListView"),
);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function NoteListPage({ searchParams }: Props) {
  const { type: noteType } = use(searchParams) as { type: INoteType };

  const isSupportedNoteType: boolean = Object.keys(INoteType).includes(noteType);

  if (!isSupportedNoteType) {
    notFound();
  }

  const { data, isLoading, error, isEmpty } = useGetNoteList(
    { type: noteType },
    { enabled: isSupportedNoteType },
  );

  if (error) {
    return <Text text={`Error: ${error.message}`} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NoteListContext value={{ noteList: data, isEmptyNoteList: isEmpty }}>
      <Suspense fallback={<Loading />}>
        {noteType === INoteType.MEMO && <NoteOfMemoListView />}
        {noteType === INoteType.STORY && <NoteOfStoryListView />}
        {noteType === INoteType.GALLERY && <NoteOfGalleryListView />}
      </Suspense>
    </NoteListContext>
  );
}
