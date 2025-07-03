import { createContext, use } from "react";

import type { INote } from "@/types";

interface INoteListContext {
  dataSource: INote[];
}

export const NoteListContext = createContext<INoteListContext>({
  dataSource: [],
});

export function useNoteListContext() {
  const context = use(NoteListContext);
  if (!context) {
    throw new Error("useNoteListContext must be used within NoteListContext Provider");
  }
  return context;
}
