import { createContext, use } from "react";

import type { INote } from "@/types";

interface INoteDetailContext {
  dataSource: INote | null;
}

export const NoteDetailContext = createContext<INoteDetailContext>({
  dataSource: null,
});

export function useNoteDetailContext() {
  const context = use(NoteDetailContext);
  if (!context) {
    throw new Error("useNoteDetailContext must be used within NoteDetailContext Provider");
  }
  return context;
}
