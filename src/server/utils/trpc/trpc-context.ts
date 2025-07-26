import type { NextRequest, NextResponse } from "next/server";

import type { IAccount } from "@/types/account";
import { prismaGetUserByEmail } from "../../db/user";

type RequestContext = {
  request: NextRequest;
  response: NextResponse;
};

type TRPCContext = RequestContext & {
  account: IAccount | null;
};

export async function createTRPCContext({ request, response }: RequestContext): Promise<TRPCContext> {
  // const session = await getServerSession();
  // TODO:
  const session = {
    email: "admin@example.com",
  };

  const user = await prismaGetUserByEmail({
    email: session.email,
  });

  if (!user) {
    return {
      request,
      response,
      account: null,
    };
  }

  return {
    request,
    response,
    account: {
      ...user,
      accessToken: "",
      refreshToken: "",
    },
  };
}
