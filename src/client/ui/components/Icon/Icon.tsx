"use client";

import { Icon as Iconify } from "@iconify/react";
import React from "react";

import { IconColors } from "../../utils";
import { IconProps } from "./Icon.types";

const Icon = React.memo<IconProps>(({ style, icon, width = 20, color = "auto", ...props }) => {
  const fontColor = React.useMemo<React.CSSProperties["color"]>(() => IconColors[color], [color]);

  return (
    <Iconify
      ssr
      icon={icon}
      style={{
        width,
        minWidth: width,
        height: width,
        minHeight: width,
        flexShrink: 0,
        display: "inline-flex",
        color: fontColor,
        ...style,
      }}
      {...props}
    />
  );
});

Icon.displayName = "Icon";
export default Icon;
