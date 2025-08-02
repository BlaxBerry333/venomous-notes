"use client";

import { QueryClient as TanstackQueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools as TanstackQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

import { trpcClient, TRPCProvider } from "./trpc-client";

let browserQueryClient: TanstackQueryClient | undefined = undefined;

function makeQueryClient(): TanstackQueryClient {
  return new TanstackQueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute 内数据不会重新获取
        gcTime: 1000 * 120, // 2 minutes 后未使用的数据会被垃圾回收
        refetchOnWindowFocus: true, // 窗口获得焦点时重新获取数据
        refetchOnMount: true, // 组件挂载时重新获取数据
        refetchOnReconnect: true, // 网络重新连接时重新获取数据
        retry: false, // 失败后不重试
      },
    },
  });
}

function initProviderQueryClient(): TanstackQueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function ClientQueryProvider({ children }: React.PropsWithChildren) {
  const [TanstackQueryClient] = React.useState<TanstackQueryClient>(initProviderQueryClient);

  return (
    <TanstackQueryClientProvider client={TanstackQueryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={TanstackQueryClient}>
        {children}
      </TRPCProvider>
      <TanstackQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" position="right" />
    </TanstackQueryClientProvider>
  );
}
