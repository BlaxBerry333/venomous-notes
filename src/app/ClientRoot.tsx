"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

const ThemeProvider = dynamic(() => import("venomous-ui").then((mod) => mod.ThemeProvider), {
  ssr: false,
});

export default function ClientRoot({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
