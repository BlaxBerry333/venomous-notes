"use client";

import { lazy, memo, Suspense, useCallback, useEffect, useState } from "react";
import { Button, Grid, useModal } from "venomous-ui";

import { useNoteListContext } from "@/client/features/note/contexts/NoteListContext";
import { type INote } from "@/types";
import NoteOfMemoCard from "../components/NoteOfMemoCard";

const NoteOfMemoDetailModal = lazy(
  () => import("@/client/features/note/components/NoteOfMemoDetailModal"),
);
const NoteOfMemoCreateModal = lazy(
  () => import("@/client/features/note/components/NoteOfMemoCreateModal"),
);
const NoteOfMemoDeleteModal = lazy(
  () => import("@/client/features/note/components/NoteOfMemoDeleteModal"),
);

const NoteOfMemoListView = memo(() => {
  const detailModalHandler = useModal();
  const createModalHandler = useModal();
  const deleteModalHandler = useModal();

  const { dataSource } = useNoteListContext();

  const [selectedMemo, setSelectedMemo] = useState<INote | null>(null);
  useEffect(() => {
    return () => setSelectedMemo(null);
  }, []);

  const handleClick = useCallback(
    (item: INote) => {
      setSelectedMemo(item);
      detailModalHandler.openModal();
    },
    [detailModalHandler],
  );

  const handleClickDelete = useCallback(
    (item: INote) => {
      setSelectedMemo(item);
      deleteModalHandler.openModal();
    },
    [deleteModalHandler],
  );

  return (
    <>
      <Button
        icon="solar:add-circle-line-duotone"
        iconPosition="start"
        text="Create"
        onClick={createModalHandler.openModal}
      />

      <Grid
        height={dataSource.length * (180 + 16) + "px"}
        width="100%"
        cols={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
        items={dataSource}
        renderGridItem={(note) => (
          <NoteOfMemoCard
            height="180px"
            margin="8px"
            noteItem={note}
            handleClick={() => handleClick(note)}
            handleClickDelete={() => handleClickDelete(note)}
          />
        )}
      />

      <Suspense>
        <NoteOfMemoDetailModal modalHandler={detailModalHandler} noteItemOfMemo={selectedMemo} />

        <NoteOfMemoCreateModal modalHandler={createModalHandler} />

        <NoteOfMemoDeleteModal modalHandler={deleteModalHandler} noteItemOfMemo={selectedMemo} />
      </Suspense>
    </>
  );
});

NoteOfMemoListView.displayName = "NoteOfMemoListView";
export default NoteOfMemoListView;
