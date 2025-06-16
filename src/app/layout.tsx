import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";

import { RootHeader, RootMain } from "@/components/layout";
import { QueryClientProvider, ThemeProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venomous Notes",
  description: "...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <QueryClientProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider>
            <RootHeader maxWidth="xl" />
            <RootMain maxWidth="xl">{children}</RootMain>
          </ThemeProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
