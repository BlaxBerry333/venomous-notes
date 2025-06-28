import type { NextRequest, NextResponse } from "next/server";

import type { IUser, PrismaClient } from "@/types";
import prismaClient from "../db/prisma-client";

type ContextData = {
  session: { user: IUser };
  prisma: PrismaClient;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createTRPCContext(req: NextRequest, res: NextResponse): Promise<ContextData> {
  // const session = await getServerSession();
  const session = {
    user: {
      id: crypto.randomUUID(),
      name: "",
      email: "",
    },
  };

  return {
    session,
    prisma: prismaClient,
  };
}
