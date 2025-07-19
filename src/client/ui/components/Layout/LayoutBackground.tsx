"use client";

import React from "react";

import { useThemeMode } from "../../hooks";
import { BackgroundColors } from "../../utils/constants/colors";

const LayoutBackground = React.memo<{ style?: React.CSSProperties }>(({ style }) => {
  const { isDarkThemeMode } = useThemeMode();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        backgroundColor: isDarkThemeMode ? BackgroundColors.dark : BackgroundColors.light,
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/static/images/background.avif"
        alt="background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
});

LayoutBackground.displayName = "LayoutBackground";
export default LayoutBackground;
