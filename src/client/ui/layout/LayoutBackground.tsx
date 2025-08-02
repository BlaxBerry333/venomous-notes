"use client";

import React from "react";
import { Theme } from "venomous-ui-react/components";
import { BackgroundColors } from "venomous-ui-react/utils";

const LayoutBackground = React.memo<{ style?: React.CSSProperties }>(({ style }) => {
  const { themeMode } = Theme.useThemeMode();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        backgroundColor: BackgroundColors[themeMode as keyof typeof BackgroundColors].primary,
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
