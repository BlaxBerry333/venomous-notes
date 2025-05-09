import { initTRPC } from "@trpc/server";
import { createTRPCContext } from "./trpc-context";

/**
 * Initialize tRPC instance
 */
export const t = initTRPC.context<typeof createTRPCContext>().create();
