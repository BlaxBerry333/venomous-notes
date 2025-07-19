import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest, NextResponse } from "next/server";

import { createTRPCContext } from "@/server/utils/trpc/trpc-context";
import { trpcServerRouter } from "@/server/utils/trpc/trpc-router";

const handler = (request: NextRequest, response: NextResponse) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: trpcServerRouter,
    createContext: () => createTRPCContext({ request, response }),
  });
};

export { handler as GET, handler as POST };
