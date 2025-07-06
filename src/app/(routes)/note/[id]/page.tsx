"use client";

import { notFound } from "next/navigation";
import { lazy, Suspense, use, type JSX } from "react";
import { Loading, Text } from "venomous-ui";

import { NoteDetailContext } from "@/client/features/note/contexts/NoteDetailContext";
import { useGetNote } from "@/client/features/note/hooks";
import { INoteType, type INote } from "@/types";

const NoteOfStoryDetailView = lazy(
  () => import("@/client/features/note/views/NoteOfStoryDetailView"),
);
const NoteOfGalleryDetailView = lazy(
  () => import("@/client/features/note/views/NoteOfGalleryDetailView"),
);

const ALLOWED_NOTE_TYPES_MAP = {
  [INoteType.STORY]: <NoteOfStoryDetailView />,
  [INoteType.GALLERY]: <NoteOfGalleryDetailView />,
} as Record<INoteType, JSX.Element>;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function NoteDetailPage({ params, searchParams }: Props) {
  const { id: noteId } = use(params);
  const { type: noteType } = use(searchParams) as { type: INoteType };

  const allowRequest: boolean =
    !!noteId && Object.keys(ALLOWED_NOTE_TYPES_MAP).includes(noteType as INoteType);

  const { data, isLoading, error, isEmpty } = useGetNote(
    { id: noteId, type: noteType },
    { enabled: allowRequest },
  );

  if (!allowRequest) {
    notFound();
  }

  if (error) {
    return <Text text={`Error: ${error.message}`} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isEmpty) {
    return <Text text="No Note" isTitle />;
  }

  return (
    <NoteDetailContext value={{ dataSource: (data as unknown as INote) || null }}>
      <Suspense fallback={<Loading />}>{ALLOWED_NOTE_TYPES_MAP[noteType as INoteType]}</Suspense>
    </NoteDetailContext>
  );
}
