"use client";

import React from "react";

import { BreakPointWidth } from "../utils";

type BreakPoint = keyof typeof BreakPointWidth;

export default function useThemeBreakpoint() {
  const [screenSize, setScreenSize] = React.useState<BreakPoint>("xs");

  React.useEffect(() => {
    const getScreenSize = (): BreakPoint => {
      const width = window.innerWidth;
      if (width >= BreakPointWidth.xxl) return "xxl";
      if (width >= BreakPointWidth.xl) return "xl";
      if (width >= BreakPointWidth.lg) return "lg";
      if (width >= BreakPointWidth.md) return "md";
      if (width >= BreakPointWidth.sm) return "sm";
      return "xs";
    };
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };
    // 初始化屏幕尺寸
    handleResize();
    // 添加事件监听器
    window.addEventListener("resize", handleResize);
    // 清理事件监听器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenSize,
  };
}
