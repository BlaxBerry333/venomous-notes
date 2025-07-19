"use client";

import React from "react";

import { useThemeMode } from "../../hooks";
import { TextColors } from "../../utils";

type Props = Partial<{
  color: keyof typeof TextColors;
  ellipsis: number;
}>;

export function useTypographyStyle({ color = "primary", ellipsis = 0 }: Props) {
  const { isDarkThemeMode } = useThemeMode();

  const fontColor = React.useMemo<React.CSSProperties["color"]>(() => {
    if (isDarkThemeMode) return color === "primary" ? TextColors.darkMode : TextColors[color];
    return TextColors[color];
  }, [color, isDarkThemeMode]);

  const ellipsisStyles = React.useMemo<React.CSSProperties>(
    () =>
      ellipsis
        ? {
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: ellipsis,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }
        : {},
    [ellipsis],
  );

  return {
    fontColor,
    ellipsisStyles,
  };
}
