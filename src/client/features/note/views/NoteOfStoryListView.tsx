"use client";

import { memo, useCallback } from "react";
import { Button, Grid, Text, useToast } from "venomous-ui";

import { INoteType } from "@/types";
import NoteOfStoryCard from "../components/NoteOfStoryCard";
import { useNoteListContext } from "../contexts/NoteListContext";
import { useCreateNote } from "../hooks";

const NoteOfStoryListView = memo(() => {
  const toast = useToast();

  const { noteList, isEmptyNoteList } = useNoteListContext();

  const createMutation = useCreateNote({
    onSuccess: () => toast({ type: "success", title: "Success to create" }),
    onError: () => toast({ type: "error", title: "Failed to create" }),
  });

  const handleCreate = useCallback(async (): Promise<void> => {
    await createMutation.mutateAsync({
      title: "New Story",
      type: INoteType.STORY,
      chapters: [],
    });
  }, [createMutation]);

  return (
    <>
      <Button icon="solar:add-circle-line-duotone" isSquare onClick={handleCreate} />

      {isEmptyNoteList && <Text text="No Note" isTitle />}

      {!isEmptyNoteList && (
        <Grid
          height={noteList.length * (360 + 16) + "px"}
          cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
          items={noteList}
          renderGridItem={(note) => (
            <NoteOfStoryCard noteItem={note} height="360px" width="260px" margin="8px" />
          )}
        />
      )}
    </>
  );
});

NoteOfStoryListView.displayName = "NoteOfStoryListView";
export default NoteOfStoryListView;
