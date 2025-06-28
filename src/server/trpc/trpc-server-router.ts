import { t } from "./trpc-init";

import { createNote, deleteNote, getNote, getNoteList, updateNote } from "./procedures/note";

const noteRouter = t.router({
  getNoteList,
  getNote,
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
