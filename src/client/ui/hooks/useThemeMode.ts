import React from "react";
import { ThemeMode } from "../components";
import { __setStoredThemeMode } from "../components/ThemeProvider/__store";
import { useThemeContext } from "../components/ThemeProvider/__useThemeContext";

export default function useThemeMode() {
  const context = useThemeContext();

  const setThemeMode = React.useCallback(
    (themeMode: ThemeMode) => {
      context.setThemeMode(themeMode);
      __setStoredThemeMode(themeMode);
    },
    [context],
  );

  const toggleThemeMode = React.useCallback(() => {
    context.toggleThemeMode();
    __setStoredThemeMode(context.themeMode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark);
  }, [context]);

  return {
    themeMode: context.themeMode,
    isDarkThemeMode: context.isDarkThemeMode,
    setThemeMode,
    toggleThemeMode,
  };
}
