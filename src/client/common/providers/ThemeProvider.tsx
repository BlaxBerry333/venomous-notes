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
const _ThemeProvider = dynamic(() => import("venomous-ui").then((mod) => mod.ThemeProvider), {
  ssr: false,
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  return <_ThemeProvider>{children}</_ThemeProvider>;
}
