import { User } from "@/.generated/prisma";

export enum EUserType {
  Super = "super_user", // $Enums.UserType.super_user
  Normal = "normal_user", // $Enums.UserType.normal_user
}

export type IUser = {
  id: User["id"];
  name: User["name"];
  email: User["email"];
  password: User["password"];
  createdAt: User["createdAt"];
  updatedAt: User["updatedAt"];
  type: EUserType;
};

export type IAccount = IUser & {
  accessToken: string;
  refreshToken: string;
};
