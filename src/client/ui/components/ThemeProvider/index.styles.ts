import { ThemeColor, ThemeMode } from "./index.types";

export const ThemeColors = Object.entries(ThemeColor).map(([key, value]) => ({
  label: key,
  value,
})) as Array<{ label: keyof typeof ThemeColor; value: ThemeColor }>;

export const ThemeModes = Object.entries(ThemeMode).map(([key, value]) => ({
  label: key,
  value,
})) as Array<{ label: keyof typeof ThemeMode; value: ThemeMode }>;
