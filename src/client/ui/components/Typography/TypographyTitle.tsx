"use client";

import React from "react";

import { useTypographyStyle } from "./__useTypographyStyle";
import { TypographyStyle } from "./index.styles";
import type { TypographyTitleProps } from "./index.types";

const TagMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
} as const;

const TypographyTitle = React.memo<TypographyTitleProps>(({ text, level = TagMap.h4, color = "primary", ellipsis, style, ...props }) => {
  const Tag = React.useMemo(() => TagMap[level], [level]);
  const fontSize = React.useMemo(() => TypographyStyle.size[level], [level]);

  const { fontColor, ellipsisStyles } = useTypographyStyle({ color, ellipsis });

  return (
    <Tag
      style={{
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
        width: "100%",
        fontSize,
        fontFamily: "inherit",
        fontWeight: "bold",
        lineHeight: "inherit",
        textAlign: "inherit",
        color: fontColor,
        ...ellipsisStyles,
        ...style,
      }}
      {...props}
    >
      {text}
    </Tag>
  );
});

TypographyTitle.displayName = "TypographyTitle";
export default TypographyTitle;
