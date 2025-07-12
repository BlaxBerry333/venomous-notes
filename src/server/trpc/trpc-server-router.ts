import { t } from "./trpc-init";

import {
  createNote,
  createNoteStoryChapter,
  deleteNote,
  deleteNoteStoryChapter,
  getNote,
  getNoteList,
  getNoteStoryChapter,
  getNoteStoryChaptersList,
  updateNote,
  updateNoteStoryChapter,
} from "./procedures/note";

const noteRouter = t.router({
  createNote,
  createNoteStoryChapter,
  deleteNote,
  deleteNoteStoryChapter,
  getNoteList,
  getNote,
  getNoteStoryChaptersList,
  getNoteStoryChapter,
  updateNote,
  updateNoteStoryChapter,
});

/**
 * Initialize tRPC server router instance
 */
export const trpcServerRouter = t.router({
  note: noteRouter,
});

/**
 * Export router type for Client
 */
export type TRPCServerRouterType = typeof trpcServerRouter;
