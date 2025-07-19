"use client";

import React from "react";

import type { CardProps } from "./index.types";

const Card = React.memo<CardProps>(({ children, style, isTransparent = false, isFrostedGlass = false, ...props }) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: `
          rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, 
          rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, 
          rgba(0, 0, 0, 0.12) 0px 1px 8px 0px
        `,
        backgroundColor: isTransparent ? "transparent" : "rgba(255, 255, 255, 0.1)",
        backdropFilter: isFrostedGlass ? "blur(8px) brightness(0.8)" : "none",
        WebkitBackdropFilter: isFrostedGlass ? "blur(8px) brightness(0.8)" : "none",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
export default Card;
