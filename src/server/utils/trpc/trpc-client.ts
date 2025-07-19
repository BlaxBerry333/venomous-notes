import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext as createTRPCContextByTanstackQuery } from "@trpc/tanstack-react-query";

import type { TRPCServerRouterType } from "./trpc-router";

export const trpcClient = createTRPCClient<TRPCServerRouterType>({
  links: [
    httpBatchLink({
      url: String(process.env.NEXT_PUBLIC_TRPC_API_URL),
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContextByTanstackQuery<TRPCServerRouterType>();
