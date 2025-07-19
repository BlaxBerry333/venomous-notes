"use client";

import React from "react";
import { ThemeColor, ThemeContextType, ThemeMode } from "./index.types";

export const ThemeContextDefaultValue: ThemeContextType = {
  themeMode: ThemeMode.Light,
  isDarkThemeMode: false,
  setThemeMode: () => {},
  toggleThemeMode: () => {},
  themeColor: ThemeColor.JadeAnaconda,
  setThemeColor: () => {},
};

export const ThemeContext = React.createContext<ThemeContextType>(ThemeContextDefaultValue);
