import { TRPCError } from "@trpc/server";

import { t } from "../trpc-init";

export const checkAuthenticationMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
    });
  }

  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});
