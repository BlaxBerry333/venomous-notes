"use client";

import { notFound } from "next/navigation";
import { lazy, Suspense, use, type JSX } from "react";
import { Loading, Text } from "venomous-ui";

import { NoteListContext } from "@/client/features/note/contexts/NoteListContext";
import { useGetNoteList } from "@/client/features/note/hooks";
import { INoteType, type INote } from "@/types";

const NoteOfMemoListView = lazy(() => import("@/client/features/note/views/NoteOfMemoListView"));
const NoteOfStoryListView = lazy(() => import("@/client/features/note/views/NoteOfStoryListView"));
const NoteOfGalleryListView = lazy(
  () => import("@/client/features/note/views/NoteOfGalleryListView"),
);

const ALLOWED_NOTE_TYPES_MAP = {
  [INoteType.MEMO]: <NoteOfMemoListView />,
  [INoteType.STORY]: <NoteOfStoryListView />,
  [INoteType.GALLERY]: <NoteOfGalleryListView />,
} as Record<INoteType, JSX.Element>;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function NoteListPage({ searchParams }: Props) {
  const { type: noteType } = use(searchParams) as { type: INoteType };

  const allowRequest: boolean = Object.keys(ALLOWED_NOTE_TYPES_MAP).includes(noteType as INoteType);

  const { data, isLoading, error, isEmpty } = useGetNoteList(
    { type: noteType },
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
    <NoteListContext value={{ dataSource: (data || []) as unknown as INote[] }}>
      <Suspense fallback={<Loading />}>{ALLOWED_NOTE_TYPES_MAP[noteType as INoteType]}</Suspense>
    </NoteListContext>
  );
}
