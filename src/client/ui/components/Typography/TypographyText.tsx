"use client";

import React from "react";

import { useTypographyStyle } from "./__useTypographyStyle";
import { TypographyStyle } from "./index.styles";
import type { TypographyTextProps } from "./index.types";

const TypographyText = React.memo<TypographyTextProps>(({ text, strong, small, color = "primary", style, ...props }) => {
  const { fontColor } = useTypographyStyle({ color });

  const commonStyle: React.CSSProperties = {
    fontSize: TypographyStyle.size.text,
    color: fontColor,
    ...style,
  };

  if (strong) {
    return (
      <strong style={commonStyle} {...props}>
        {text}
      </strong>
    );
  }

  if (small) {
    return (
      <small style={commonStyle} {...props}>
        {text}
      </small>
    );
  }

  return (
    <span style={commonStyle} {...props}>
      {text}
    </span>
  );
});

TypographyText.displayName = "TypographyText";
export default TypographyText;
