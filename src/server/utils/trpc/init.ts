import { initTRPC } from "@trpc/server";
import { createTRPCContext } from "./trpc-context";

export const t = initTRPC.context<typeof createTRPCContext>().create();
