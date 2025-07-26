"use client";

import Image from "next/image";
import React from "react";
import { Space, Theme, Typography } from "venomous-ui-react/components";
import { useThemeBreakpoint } from "venomous-ui-react/hooks";
import { getColors } from "venomous-ui-react/utils";

const HomeDescription = React.memo(() => {
  const { themeColor } = Theme.useThemeColor();
  const { screenSize } = useThemeBreakpoint();
  const isXs = screenSize === "xs";

  return (
    <Space.Flex
      style={{
        padding: `50px ${isXs ? 0 : "16px"}`,
        width: "100%",
        flexDirection: isXs ? "column-reverse" : "row",
        alignItems: "center",
        justifyContent: isXs ? "center" : "space-between",
      }}
    >
      {/* Titles */}
      <Space.Flex
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
          as={isXs ? "h2" : "h1"}
          style={{
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
          }}
        />
        <Typography.Title
          text="A personal note management system."
          as={isXs ? "h5" : "h4"}
          style={{
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Space.Flex>

      {/* Logo */}
      <Space.Flex style={{ width: "max-content", marginRight: !isXs ? "40px" : "0px" }}>
        <Image width={isXs ? 200 : 300} height={isXs ? 200 : 300} src="/logo.svg" alt="Logo" draggable={false} priority />
        <Space.Flex
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
      </Space.Flex>
    </Space.Flex>
  );
});

HomeDescription.displayName = "HomeDescription";
export default HomeDescription;
