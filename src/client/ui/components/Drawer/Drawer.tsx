"use client";

import React from "react";

import { useThemeMode } from "../../hooks";
import { BackgroundColors } from "../../utils/constants/colors";
import { Button } from "../Button";
import { DrawerProps } from "./index.types";

const Drawer = React.memo<DrawerProps>(
  ({ isOpen, onClose, children, position = "left", maskClosable = true, showClose = false, width = 300, height = 300, style }) => {
    const { isDarkThemeMode } = useThemeMode();

    // 计算不同方向的样式
    let panelStyle: React.CSSProperties = {
      position: "fixed",
      backgroundColor: isDarkThemeMode ? BackgroundColors.dark : BackgroundColors.light,
      boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
      transition: "transform 0.3s ease",
      zIndex: 1000,
      ...style,
    };
    let transform = "";
    if (position === "left") {
      panelStyle = {
        ...panelStyle,
        top: 0,
        left: 0,
        width,
        height: "100svh",
        borderRight: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      };
      transform = isOpen ? "translateX(0)" : "translateX(-100%)";
    } else if (position === "right") {
      panelStyle = {
        ...panelStyle,
        top: 0,
        right: 0,
        width,
        height: "100svh",
        borderLeft: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      };
      transform = isOpen ? "translateX(0)" : "translateX(100%)";
    } else if (position === "top") {
      panelStyle = {
        ...panelStyle,
        top: 0,
        left: 0,
        width: "100svw",
        height,
        borderBottom: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      };
      transform = isOpen ? "translateY(0)" : "translateY(-100%)";
    } else if (position === "bottom") {
      panelStyle = {
        ...panelStyle,
        bottom: 0,
        left: 0,
        width: "100svw",
        height,
        borderTop: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      };
      transform = isOpen ? "translateY(0)" : "translateY(100%)";
    }
    panelStyle.transform = transform;

    return (
      <>
        {/* Overlay */}
        <div
          onClick={maskClosable ? onClose : undefined}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100svh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 0.3s ease",
            zIndex: 999,
          }}
        />

        {/* Drawer Panel */}
        <div style={panelStyle}>
          {showClose && (
            <Button
              variant="ghost"
              icon="solar:close-circle-line-duotone"
              onClick={onClose}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 1001,
              }}
            />
          )}
          {children}
        </div>
      </>
    );
  },
);

Drawer.displayName = "Drawer";
export default Drawer;
