"use client";

import React from "react";

import { TypographyStyle } from "./index.styles";
import type { TypographyCodeProps } from "./index.types";

const TypographyCode = React.memo<TypographyCodeProps>(({ text, style, ...props }) => {
  return (
    <code
      style={{
        color: "#B71D18",
        backgroundColor: "#E7E9EB",
        border: "1px solid #CCCCCC",
        borderRadius: "4px",
        padding: "2px 4px",
        fontSize: TypographyStyle.size.small,
        fontWeight: "bold",
        ...style,
      }}
      {...props}
    >
      {text}
    </code>
  );
});

TypographyCode.displayName = "TypographyCode";
export default TypographyCode;
