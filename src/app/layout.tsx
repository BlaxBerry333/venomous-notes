import "@/client/styles/globals.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { RootHeader, RootMain } from "@/client/common/layout";
import { QueryClientProvider, ThemeProvider } from "@/client/common/providers";
import fonts from "@/client/styles/fonts";

export const metadata: Metadata = {
  title: "Venomous Notes",
  description: "...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <QueryClientProvider>
      <html lang="en">
        <body className={`${fonts.geistSans.variable} ${fonts.geistMono.variable}`}>
          <ThemeProvider>
            <RootHeader maxWidth="xl" />
            <RootMain maxWidth="xl">{children}</RootMain>
          </ThemeProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
