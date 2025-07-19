"use client";

import React from "react";

import { ThemeContext } from "./ThemeContext";
import type { ThemeContextType } from "./index.types";

export function useThemeContext(): ThemeContextType {
  const context = React.use(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
