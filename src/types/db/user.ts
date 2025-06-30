import { type User as IUser } from "@/generated/prisma";

export { UserType, type User as IUser } from "@/generated/prisma";

export type IAccount = {
  id: IUser["id"];
  name: IUser["name"];
  email: IUser["email"];
};
