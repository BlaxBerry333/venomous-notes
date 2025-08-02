"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Buttons, Container, Drawer, Space, Theme, Typography } from "venomous-ui-react/components";
import { useHandler } from "venomous-ui-react/hooks";

import { LayoutStyle } from "./index.styles";

const LayoutHeader = React.memo(() => {
  const { toggleThemeMode, isDarkThemeMode } = Theme.useThemeMode();
  const { screenSize } = Theme.useThemeBreakpoint();
  const isLg = screenSize === "lg";

  return (
    <Space.Flex
      column
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: LayoutStyle.Header.height,
        padding: `0px ${!isLg ? "8px" : "0px"}`,
        borderBottom: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        backdropFilter: "blur(20px)",
      }}
    >
      <Container
        breakpoint="lg"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SmallLayoutHeaderContent />
        <LargeLayoutHeaderContent />

        {/* Header Actions */}
        <Space.Flex row gap={16} style={{ height: "100%", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          {/* Theme Mode */}
          <Buttons.Icon variant="ghost" icon={isDarkThemeMode ? "solar:moon-bold-duotone" : "solar:sun-2-line-duotone"} onClick={toggleThemeMode} />
          {/* Account */}
          <Link href="/account" scroll style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://avatars.githubusercontent.com/u/166675080?v=4" alt="avatar" width={40} height={40} style={{ cursor: "pointer" }} />
          </Link>
        </Space.Flex>
      </Container>
    </Space.Flex>
  );
});

LayoutHeader.displayName = "LayoutHeader";
export default LayoutHeader;

export const SMALL_LAYOUT_SIDENAV_DRAWER_HEADER_KEY = "setting-drawer-header" as const;
export const SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY = "setting-drawer-content" as const;

const SmallLayoutHeaderContent = React.memo(() => {
  const { isDarkThemeMode } = Theme.useThemeMode();
  const drawerHandler = useHandler();
  const { screenSize } = Theme.useThemeBreakpoint();
  const isXs = screenSize === "xs";
  if (!isXs) {
    return null;
  }
  return (
    <>
      <Buttons.Icon variant="ghost" icon="solar:hamburger-menu-line-duotone" onClick={drawerHandler.open} />
      <Drawer position="left" isOpen={drawerHandler.isOpen} onClose={drawerHandler.close} width={300} maskClosable style={{ padding: 0 }}>
        <Space.Flex
          row
          style={{
            height: LayoutStyle.Header.height,
            padding: "0px 16px",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
          }}
        >
          {/* Portal Target */}
          <div id={SMALL_LAYOUT_SIDENAV_DRAWER_HEADER_KEY} />
          <Buttons.Icon variant="ghost" icon="material-symbols:close-rounded" onClick={drawerHandler.close} />
        </Space.Flex>
        <Space.Flex
          style={{
            height: `calc(100svh - ${LayoutStyle.Header.height}px)`,
            overflowY: "scroll",
            padding: "16px",
          }}
        >
          {/* Portal Target */}
          <div id={SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY} />
        </Space.Flex>
      </Drawer>
    </>
  );
});
SmallLayoutHeaderContent.displayName = "SmallLayoutHeaderContent";

const LargeLayoutHeaderContent = React.memo(() => {
  const { screenSize } = Theme.useThemeBreakpoint();
  const isXs = screenSize === "xs";
  if (isXs) {
    return null;
  }
  return (
    <>
      {/* Header Title */}
      <Link href="/" scroll>
        <Space.Flex row style={{ alignItems: "center" }}>
          {/* Title Logo */}
          <Image width={40} height={40} src="/logo.svg" alt="Logo" draggable={false} priority />
          {/* Title Text */}
          <Typography.Title
            text={"Notes".slice(1)}
            as="h3"
            style={{
              transform: "translate(-10px, 6px)",
              visibility: isXs ? "hidden" : "visible",
            }}
          />
        </Space.Flex>
      </Link>
    </>
  );
});
LargeLayoutHeaderContent.displayName = "LargeLayoutHeaderContent";
