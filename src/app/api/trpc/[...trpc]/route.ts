import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest, NextResponse } from "next/server";

import { createTRPCContext } from "@/utils/trpc/trpc-context";
import { trpcServerRouter } from "@/utils/trpc/trpc-server-router";

/**
 * Handler for GET/POST requests to `/api/trpc/*`
 */
const handler = (req: NextRequest, res: NextResponse) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: trpcServerRouter,
    createContext: () => createTRPCContext(req, res),
  });
};

export { handler as GET, handler as POST };
