import { TRPCError } from "@trpc/server";

import { userZodSchemas } from "@/types/account";
import { prismaCreateUser, prismaGetUserByEmail } from "../db/user";
import { t } from "../utils/trpc/init";
import { trpcAuthMiddleware } from "../utils/trpc/trpc-middlewares";

/**
 * get specific user by user.email
 */
export const getUserByEmail = t.procedure.use(trpcAuthMiddleware).query(async ({ ctx }) => {
  try {
    const user = await prismaGetUserByEmail({
      email: ctx.account!.email,
    });
    return user;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR", // 500
      message: `Failed to get user by email. ${(error as Error).message}`,
    });
  }
});

/**
 * create user
 */
export const createUser = t.procedure.input(userZodSchemas.CreateUserInput).mutation(async ({ input }) => {
  try {
    const user = await prismaCreateUser(input);
    return user;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR", // 500
      message: `Failed to create user. ${(error as Error).message}`,
    });
  }
});
