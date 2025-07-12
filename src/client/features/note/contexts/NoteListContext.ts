import { createContext, use } from "react";

import type { INote } from "@/types";

export interface INoteListContext {
  noteList: INote[];
  isEmptyNoteList: boolean;
}

export const NoteListContext = createContext<INoteListContext>({
  noteList: [],
  isEmptyNoteList: false,
});

export function useNoteListContext() {
  const context = use(NoteListContext);
  if (!context) {
    throw new Error("useNoteListContext must be used within NoteListContext Provider");
  }
  return context;
}
