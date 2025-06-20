import { t } from "./trpc-init";

import { createNote, deleteNote, getNoteById, getNoteList, updateNote } from "./procedures/note";

/**
 * Initialize tRPC server router instance
 */
export const trpcServerRouter = t.router({
  getNoteList,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
});

/**
 * Export router type for Client
 */
export type TRPCServerRouterType = typeof trpcServerRouter;
