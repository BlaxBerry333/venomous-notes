import { t } from "./trpc-init";

import {
  createNote,
  deleteNote,
  getNote,
  getNoteList,
  getNoteStoryCharacterContent,
  getNoteStoryCharactersList,
  updateNote,
} from "./procedures/note";

const noteRouter = t.router({
  getNoteList,
  getNote,
  getNoteStoryCharactersList,
  getNoteStoryCharacterContent,
  createNote,
  updateNote,
  deleteNote,
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
