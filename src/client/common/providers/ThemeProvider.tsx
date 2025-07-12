"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

/**
 * ThemeProvider wrapper using Next.js dynamic import
 *
 * This component dynamically imports the ThemeProvider from venomous-ui
 * with SSR disabled to prevent "ReferenceError: window is not defined" errors.
 *
 * The error occurs during server-side rendering because the ThemeProvider
 * component relies on browser-specific APIs (window object) that don't exist
 * in Node.js environment.
 */
const UIThemeProvider = dynamic(() => import("venomous-ui").then((mod) => mod.ThemeProvider), {
  ssr: false,
});
const UIToast = dynamic(() => import("venomous-ui").then((mod) => mod.Toast), {
  ssr: false,
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <UIThemeProvider>
      {children}
      <UIToast position="top-center" />
    </UIThemeProvider>
  );
}
