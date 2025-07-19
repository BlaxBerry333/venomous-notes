export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export enum ThemeColor {
  ScarletViper = "#D32F2F", // 猩红蝮蛇
  JadeAnaconda = "#26A69A", // 翡翠森蚺
  AmethystRattlesnake = "#9575CD", // 紫晶响尾蛇
  AmberCobra = "#FFB300", // 琥珀眼镜蛇
  ObsidianBothrops = "#455A64", // 黑曜矛头蝰
}

export interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkThemeMode: boolean;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleThemeMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (themeColor: ThemeColor) => void;
}

export interface ThemeProviderProps extends React.PropsWithChildren {
  defaultThemeMode?: ThemeMode;
  defaultThemeColor?: ThemeColor;
}
