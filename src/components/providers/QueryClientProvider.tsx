"use client";

import {
  QueryClient as TanstackQueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools as TanstackQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type PropsWithChildren } from "react";

import { trpcClient, TRPCProvider } from "@/utils/trpc/trpc-client";

let browserQueryClient: TanstackQueryClient | undefined = undefined;

function makeQueryClient() {
  return new TanstackQueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute 内数据不会重新获取
        gcTime: 120 * 1000, // 2 minutes 后未使用的数据会被垃圾回收
        refetchOnWindowFocus: true, // 窗口获得焦点时重新获取数据
        refetchOnMount: true, // 组件挂载时重新获取数据
        refetchOnReconnect: true, // 网络重新连接时重新获取数据
        retry: false, // 失败后不重试
      },
    },
  });
}

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const [TanstackQueryClient] = useState<TanstackQueryClient>(() => {
    if (typeof window === "undefined") {
      return makeQueryClient();
    }
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  });

  return (
    <TanstackQueryClientProvider client={TanstackQueryClient}>
      <TanstackQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />

      <TRPCProvider trpcClient={trpcClient} queryClient={TanstackQueryClient}>
        {children}
      </TRPCProvider>
    </TanstackQueryClientProvider>
  );
}
