import { TRPCError } from "@trpc/server";

import { t } from "../trpc-init";

export const trpcAuthMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.account) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
    });
  }

  return next();
});
