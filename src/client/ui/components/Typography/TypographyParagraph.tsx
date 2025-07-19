"use client";

import React from "react";

import { useTypographyStyle } from "./__useTypographyStyle";
import { TypographyStyle } from "./index.styles";
import type { TypographyParagraphProps } from "./index.types";

const TypographyParagraph = React.memo<TypographyParagraphProps>(({ text, bold, color = "primary", style, ellipsis, ...props }) => {
  const { fontColor, ellipsisStyles } = useTypographyStyle({ color, ellipsis });

  return (
    <p
      style={{
        boxSizing: "border-box",
        width: "100%",
        fontSize: TypographyStyle.size.text,
        fontWeight: bold ? "bold" : "normal",
        color: fontColor,
        ...ellipsisStyles,
        ...style,
      }}
      {...props}
    >
      {text}
    </p>
  );
});

TypographyParagraph.displayName = "TypographyParagraph";
export default TypographyParagraph;
