import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext as createTRPCContextByTanstackQuery } from "@trpc/tanstack-react-query";

import type { TRPCServerRouterType } from "./trpc-server-router";

export const trpcClient = createTRPCClient<TRPCServerRouterType>({
  links: [
    httpBatchLink({
      url: "http://localhost:7000/api/trpc",
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContextByTanstackQuery<TRPCServerRouterType>();
