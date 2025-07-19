import type { Metadata } from "next";
import React from "react";

import { GlobalFontFamily } from "@/client/styles/fonts";
import "@/client/styles/global.css";
import { AppProvider, Layout } from "@/client/ui/components";
import ClientQueryProvider from "@/server/utils/trpc/trpc-client-query-provider";
export const metadata: Metadata = {
  title: {
    default: "Venomous Notes",
    template: "%s | Venomous Notes",
  },
  description: "...",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <ClientQueryProvider>
      <html lang="en">
        <body style={{ fontFamily: GlobalFontFamily }}>
          <AppProvider>
            <Layout.Provider>
              <Layout.Header />
              <Layout.Main>{children}</Layout.Main>
            </Layout.Provider>
          </AppProvider>
        </body>
      </html>
    </ClientQueryProvider>
  );
}
