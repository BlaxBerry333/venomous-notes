import z from "zod";
import { EUserType } from "./prisma-convert";

const userFields = {
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
  type: z.nativeEnum(EUserType),
  createdAt: z.date(),
  updatedAt: z.date(),
};

export const userZodSchemas = {
  GetUserByEmailInput: z.object({}).extend({
    email: userFields.email,
  }),

  GetUsersFilteredInput: z
    .object({})
    .extend({ ...userFields })
    .partial(),

  CreateUserInput: z.object({}).extend({
    name: userFields.name,
    email: userFields.email,
    password: userFields.password,
    type: userFields.type,
  }),
};

export type IGetUserByEmailInput = z.infer<typeof userZodSchemas.GetUserByEmailInput>;
export type IGetUsersFilteredInput = z.infer<typeof userZodSchemas.GetUsersFilteredInput>;
export type ICreateUserInput = z.infer<typeof userZodSchemas.CreateUserInput>;
