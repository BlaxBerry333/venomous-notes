"use client";

import React from "react";

import { getSystemThemeMode } from "../../utils";
import { __getStoredThemeColor, __getStoredThemeMode } from "./__store";
import useThemeDesignInject from "./__useThemeDesignInject";
import { ThemeColor, ThemeContextType, ThemeMode, type ThemeProviderProps } from "./index.types";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = React.memo<ThemeProviderProps>(({ children, defaultThemeColor, defaultThemeMode }) => {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(() => {
    const stored = __getStoredThemeMode();
    return stored || defaultThemeMode || getSystemThemeMode();
  });

  const [themeColor, setThemeColor] = React.useState<ThemeColor>(() => {
    const stored = __getStoredThemeColor();
    return stored || defaultThemeColor || ThemeColor.JadeAnaconda;
  });

  useThemeDesignInject();

  const memoryValue = React.useMemo<ThemeContextType>(
    () => ({
      themeMode,
      isDarkThemeMode: themeMode === ThemeMode.Dark,
      setThemeMode,
      toggleThemeMode: () => setThemeMode((s) => (s === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark)),
      themeColor,
      setThemeColor,
    }),
    [themeMode, setThemeMode, themeColor, setThemeColor],
  );

  return <ThemeContext value={memoryValue}>{children}</ThemeContext>;
});

ThemeProvider.displayName = "ThemeProvider";
export default ThemeProvider;
