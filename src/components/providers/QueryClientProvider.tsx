"use client";

import {
  QueryClient as TanstackQueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

import { trpcClient, TRPCProvider } from "@/utils/trpc/trpc-client";

let browserQueryClient: TanstackQueryClient | undefined = undefined;

function makeQueryClient() {
  return new TanstackQueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [TanstackQueryClient] = useState<TanstackQueryClient>(() => {
    if (typeof window === "undefined") {
      return makeQueryClient();
    }
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  });

  return (
    <TanstackQueryClientProvider client={TanstackQueryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={TanstackQueryClient}>
        {children}
      </TRPCProvider>
    </TanstackQueryClientProvider>
  );
}
