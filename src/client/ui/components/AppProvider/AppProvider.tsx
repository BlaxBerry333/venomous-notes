"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

import { LayoutStyle } from "../Layout";
import { ThemeColor, ThemeMode } from "../ThemeProvider";

/**
 * 用于包裹项目应用中的客户端组件
 *
 * 可以解决 Next.js 的报错
 * "ReferenceError: window is not defined" errors.
 *
 * The error occurs during server-side rendering because the ThemeProvider
 * component relies on browser-specific APIs (window object) that don't exist
 * in Node.js environment.
 */
const ThemeProvider = dynamic(() => import("@/client/ui/components/ThemeProvider").then((mod) => mod.ThemeProvider), {
  ssr: false,
});
const Notification = dynamic(() => import("@/client/ui/components/Notification").then((mod) => mod.Notification), {
  ssr: false,
});

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultThemeMode={ThemeMode.Light} defaultThemeColor={ThemeColor.JadeAnaconda}>
      <Notification position="top-right" offset={LayoutStyle.Header.height} />
      {children}
    </ThemeProvider>
  );
}
