"use client";

import React from "react";

import type { FlexProps } from "./index.types";

const Flex = React.memo<FlexProps>(({ children, style, row = true, column = false, gap = "8px", ...props }) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: column ? "column" : row ? "row" : "row",
        alignItems: row ? "flex-start" : style?.alignItems,
        gap,
        position: "relative",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Flex.displayName = "Flex";
export default Flex;
