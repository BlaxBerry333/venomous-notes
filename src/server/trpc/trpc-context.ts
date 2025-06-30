import type { NextRequest, NextResponse } from "next/server";

import type { IAccount } from "@/types";
import prismaClient from "../db/prisma-client";

type ContextData = {
  account: IAccount;
  request: NextRequest;
  response: NextResponse;
};

export async function createTRPCContext(
  request: ContextData["request"],
  response: ContextData["response"],
): Promise<ContextData> {
  // const session = await getServerSession();
  const session = {
    user: {
      name: "admin",
      email: "admin@example.com",
    },
  };

  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
  });

  return {
    request,
    response,
    account: {
      ...session.user,
      id: user?.id || "",
    },
  };
}
