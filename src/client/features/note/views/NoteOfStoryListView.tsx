"use client";

import { memo } from "react";
import { Text } from "venomous-ui";

// import {
//   useCreateNote,
//   useDeleteNote,
//   useGetNoteList,
// } from "@/client/features/note/hooks";

const NoteOfStoryListView = memo(() => {
  //   const { mutateAsync: createNote } = useCreateNote();
  // const { mutateAsync: updateNote } = useUpdateNote();
  //   const { mutateAsync: deleteNote } = useDeleteNote();

  return <Text text="Developing... Coming soon" />;
});

NoteOfStoryListView.displayName = "NoteOfStoryListView";
export default NoteOfStoryListView;
