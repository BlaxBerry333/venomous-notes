export const Colors = {
  disabled: "#e4edf4", // 禁用 (灰)
  success: "#4caf50", // 成功 (绿)
  error: "#f44336", // 错误 (红)
  warning: "#ff9800", // 警告 (橙)
  info: "#2196f3", // 信息 (蓝)
} as const;

export const BackgroundColors = {
  light: "#ffffff", // 明亮主题背景色
  dark: "#181818", // 暗黑主题背景色
};

export const TextColors = {
  disabled: Colors.disabled,
  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
  link: "#1976d2", // 链接文本色 (蓝)
  primary: "#212121", // 主文本色 (深灰接近黑)
  secondary: "#666666", // 次级文本色 (深灰)
  darkMode: "#cccccc", // 暗黑主题文本色
} as const;

export const IconColors = {
  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
  info: Colors.info,
  auto: "auto",
  white: "#ffffff",
} as const;

export const ButtonColors = {
  disabled: Colors.disabled,
  error: Colors.error,
  auto: "auto",
} as const;
