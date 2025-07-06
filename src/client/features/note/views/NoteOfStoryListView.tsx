"use client";

import { memo, useCallback } from "react";
import { Button, Grid, useToast } from "venomous-ui";

import { MOCK_LIST_NOTE_OF_STORY } from "@/__mock__";
import NoteOfStoryCard from "../components/NoteOfStoryCard";
import { useNoteListContext } from "../contexts/NoteListContext";
import { useCreateNote } from "../hooks";

const NoteOfStoryListView = memo(() => {
  const toast = useToast();

  const { dataSource } = useNoteListContext();
  console.log({ dataSource });

  const createMutation = useCreateNote({
    onSuccess: () => toast({ type: "success", title: "Success to create" }),
    onError: () => toast({ type: "error", title: "Failed to create" }),
  });

  const handleCreate = useCallback(async () => {
    await createMutation.mutateAsync(MOCK_LIST_NOTE_OF_STORY[0]);
  }, [createMutation]);

  return (
    <>
      <Button
        icon="solar:add-circle-line-duotone"
        iconPosition="start"
        text="Create"
        onClick={handleCreate}
      />

      <Grid
        height="100%"
        width="100%"
        cols={{ xs: 2, sm: 3, md: 4, lg: 6, xl: 6 }}
        items={MOCK_LIST_NOTE_OF_STORY}
        renderGridItem={(note) => (
          <NoteOfStoryCard
            noteItem={note}
            height="260px"
            width={{
              xs: "40vw",
              sm: "30vw",
              md: "22vw",
              lg: "15vw",
              xl: "11vw",
            }}
          />
        )}
      />
    </>
  );
});

NoteOfStoryListView.displayName = "NoteOfStoryListView";
export default NoteOfStoryListView;
