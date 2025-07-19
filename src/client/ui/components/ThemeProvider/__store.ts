import { ThemeColor, ThemeMode } from "./index.types";

const VENOMOUS_UI_STORE_KEY = {
  themeColor: "VENOMOUS_UI__themeColor",
  themeMode: "VENOMOUS_UI__themeMode",
} as const;

export function __getStoredThemeColor(): ThemeColor | undefined {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(VENOMOUS_UI_STORE_KEY.themeColor);
    if (stored && Object.values(ThemeColor).includes(stored as ThemeColor)) {
      return stored as ThemeColor;
    }
  }
}

export function __getStoredThemeMode(): ThemeMode | undefined {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(VENOMOUS_UI_STORE_KEY.themeMode);
    if (stored && Object.values(ThemeMode).includes(stored as ThemeMode)) {
      return stored as ThemeMode;
    }
  }
}

export function __setStoredThemeColor(themeColor: ThemeColor) {
  if (typeof window !== "undefined") {
    localStorage.setItem(VENOMOUS_UI_STORE_KEY.themeColor, themeColor);
  }
}

export function __setStoredThemeMode(themeMode: ThemeMode) {
  if (typeof window !== "undefined") {
    localStorage.setItem(VENOMOUS_UI_STORE_KEY.themeMode, themeMode);
  }
}
