"use client";

import Image from "next/image";
import React from "react";

import { Flex, Typography } from "@/client/ui/components";
import { useThemeBreakpoint, useThemeColor } from "@/client/ui/hooks";
import { getColors } from "@/client/ui/utils";

const HomeDescription = React.memo(() => {
  const { themeColor } = useThemeColor();
  const { screenSize } = useThemeBreakpoint();
  const isXs = screenSize === "xs";

  return (
    <Flex
      style={{
        padding: `50px ${isXs ? 0 : "16px"}`,
        width: "100%",
        flexDirection: isXs ? "column-reverse" : "row",
        alignItems: "center",
        justifyContent: isXs ? "center" : "space-between",
      }}
    >
      {/* Titles */}
      <Flex
        column
        style={{
          margin: `${isXs ? "40px" : "0px"} 0px`,
          lineHeight: 1,
          flex: 1,
          textAlign: isXs ? "center" : "left",
          alignItems: isXs ? "center" : "flex-start",
          padding: `0px ${isXs ? 0 : "16px"}`,
        }}
      >
        <Typography.Title
          text="Venomous Notes"
          level={isXs ? "h2" : "h1"}
          color="primary"
          style={{
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
          }}
        />
        <Typography.Title
          text="A personal note management system."
          level={isXs ? "h5" : "h4"}
          color="secondary"
          style={{
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Flex>

      {/* Logo */}
      <Flex style={{ marginRight: !isXs ? "40px" : "0px" }}>
        <Image width={isXs ? 200 : 300} height={isXs ? 200 : 300} src="/logo.svg" alt="Logo" draggable={false} priority />
        <Flex
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 300,
            height: 300,
            zIndex: -1,
            backgroundImage: `linear-gradient(45deg, ${getColors(themeColor).light}, ${getColors(themeColor).opacity})`,
            filter: "blur(80px)",
          }}
        />
      </Flex>
    </Flex>
  );
});

HomeDescription.displayName = "HomeDescription";
export default HomeDescription;
