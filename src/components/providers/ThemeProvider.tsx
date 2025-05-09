"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

const _ThemeProvider = dynamic(() => import("venomous-ui").then((mod) => mod.ThemeProvider), {
  ssr: false,
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  return <_ThemeProvider>{children}</_ThemeProvider>;
}
