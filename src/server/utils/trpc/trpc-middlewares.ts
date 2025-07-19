import { EUserType } from "@/types/account";
import { TRPCError } from "@trpc/server";
import { t } from "./init";

/**
 * account
 */
export const trpcAuthMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.account) {
    throw new TRPCError({
      code: "UNAUTHORIZED", // 401
      message: "User not authenticated",
    });
  }
  return next();
});

/**
 * account permission
 */
export const trpcAdminPermissionMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.account || ctx.account.type !== EUserType.Super) {
    throw new TRPCError({
      code: "FORBIDDEN", // 403
      message: "Admin only",
    });
  }
  return next();
});

// const redis = new Redis();
// export const trpcRateLimitMiddleware = t.middleware(async ({ ctx, path, next }) => {
//   const userId = ctx.account?.id || ctx.ip;
//   const key = `rl:${userId}:${path}`;
//   const limit = 100;
//   const windowInSeconds = 60;
//   const current = await redis.incr(key);
//   if (current === 1) {
//     await redis.expire(key, windowInSeconds);
//   }
//   if (current > limit) {
//     throw new TRPCError({
//       code: "TOO_MANY_REQUESTS", // 429
//       message: "Rate limit exceeded",
//     });
//   }
//   return next();
// });
