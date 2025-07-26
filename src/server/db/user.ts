import prismaClient from "@/server/utils/prisma/prisma-client";
import type { ICreateUserInput, IGetUserByEmailInput, IGetUsersFilteredInput, IUser } from "@/types/account";

/**
 * get specific user by user.email
 */
export async function prismaGetUserByEmail(input: IGetUserByEmailInput): Promise<IUser | null> {
  const user = await prismaClient.user.findUnique({
    where: {
      email: input.email,
    },
  });
  return user as IUser | null;
}

/**
 * get filtered users
 */
export async function prismaGetUsersFiltered(input: IGetUsersFilteredInput): Promise<IUser[]> {
  const users = await prismaClient.user.findMany({
    where: {
      id: input.id,
      name: input.name,
      email: input.email,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      type: input.type,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return users as IUser[];
}

/**
 * create user
 */
export async function prismaCreateUser(input: ICreateUserInput): Promise<IUser> {
  const isExist = await prismaGetUserByEmail({
    email: input.email,
  });
  if (isExist) {
    throw new Error("User already exists.");
  }
  const user = await prismaClient.user.create({
    data: input,
  });
  return user as IUser;
}
