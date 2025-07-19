"use client";

import React from "react";

import { Flex } from "../Flex";
import { Typography } from "../Typography";
import Card from "./Card";
import type { CardsBookProps } from "./index.types";

const CardsBook = React.memo<CardsBookProps>(({ children, height, width, title, coverImage }) => {
  return (
    <Card
      style={{
        height,
        width,
        padding: "16px 24px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        backgroundColor: "transparent",
        backgroundImage: `url(${coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#ffffff",
        transition: "all 0s ease-in-out",
        position: "relative",
        boxShadow: "-6px 6px 10px -2px #001b4440,0 0 3px #8f9aaf1a",
      }}
    >
      {children}

      {/* Book 订装线 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 1,
          width: "16px",
          height: "100%",
          background: "linear-gradient(-90deg, #fff0, #ffffff1a 80%, #ffffff4d 95%, #fff6 96.5%, #cbcbcb14 98 %,#6a6a6a1a)",
          borderRight: "8px",
        }}
      />

      {/* Book 标题 */}
      <Flex
        column
        style={{
          height: "max-content",
          width: "100%",
          position: "relative",
          zIndex: 1,
          left: 6,
          top: 40,
        }}
      >
        <Typography.Title
          text={title}
          level="h4"
          ellipsis={4}
          style={{
            lineHeight: 1.15,
            color: "#ffffff",
            textShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)",
          }}
        />
      </Flex>
    </Card>
  );
});

CardsBook.displayName = "CardsBook";
export default CardsBook;
