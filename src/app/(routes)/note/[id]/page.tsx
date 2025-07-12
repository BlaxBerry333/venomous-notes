"use client";

import { notFound } from "next/navigation";
import { lazy, Suspense, use } from "react";
import { Loading, Text } from "venomous-ui";

import { NoteDetailContext } from "@/client/features/note/contexts/NoteDetailContext";
import { useGetNote } from "@/client/features/note/hooks";
import { INoteType } from "@/types";

const NoteOfStoryDetailView = lazy(
  () => import("@/client/features/note/views/NoteOfStoryDetailView"),
);
const NoteOfGalleryDetailView = lazy(
  () => import("@/client/features/note/views/NoteOfGalleryDetailView"),
);

const SUPPORTED_NOTE_TYPE_IN_DETAIL_PAGE: INoteType[] = [INoteType.STORY, INoteType.GALLERY];

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function NoteDetailPage({ params, searchParams }: Props) {
  const { id: noteId } = use(params);
  const { type: noteType } = use(searchParams) as { type: INoteType };

  const isSupportedNoteType: boolean =
    !!noteId && SUPPORTED_NOTE_TYPE_IN_DETAIL_PAGE.includes(noteType);

  if (!isSupportedNoteType) {
    notFound();
  }

  const { data, isLoading, error } = useGetNote(
    { id: noteId, type: noteType as INoteType },
    { enabled: isSupportedNoteType },
  );

  if (error) {
    return <Text text={`Error: ${error.message}`} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NoteDetailContext value={{ selectedNote: data }}>
      <Suspense fallback={<Loading />}>
        {noteType === INoteType.STORY && <NoteOfStoryDetailView />}
        {noteType === INoteType.GALLERY && <NoteOfGalleryDetailView />}
      </Suspense>
    </NoteDetailContext>
  );
}
