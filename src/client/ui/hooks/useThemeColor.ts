"use client";

import React from "react";

import { __setStoredThemeColor } from "../components/ThemeProvider/__store";
import { useThemeContext } from "../components/ThemeProvider/__useThemeContext";
import { ThemeColor } from "../components/ThemeProvider/index.types";

export default function useThemeColor() {
  const context = useThemeContext();

  const setThemeColor = React.useCallback(
    (color: ThemeColor) => {
      context.setThemeColor(color);
      __setStoredThemeColor(color);
    },
    [context],
  );

  return {
    themeColor: context.themeColor,
    setThemeColor,
  };
}
