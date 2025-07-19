"use client";

import React from "react";

import { useThemeBreakpoint } from "../../hooks";
import { BreakPointWidth } from "../../utils";
import { GridProps } from "./index.types";

type BreakPoint = keyof typeof BreakPointWidth;

const Grid = React.memo<GridProps>(({ columns = 1, spacing = 16, children, style, ...props }) => {
  const { screenSize } = useThemeBreakpoint();

  // 获取当前屏幕尺寸对应的列数
  const getCurrentColumns = React.useCallback((): number => {
    if (typeof columns === "number") {
      return columns;
    }
    // 按屏幕尺寸从大到小检查，找到第一个匹配的断点
    const breakpoints: BreakPoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];
    const currentIndex = breakpoints.indexOf(screenSize);
    // 从当前断点开始往下查找，找到第一个有定义的值
    for (let i = currentIndex; i < breakpoints.length; i++) {
      const breakpoint = breakpoints[i];
      const columnValue = (columns as Partial<Record<BreakPoint, number>>)[breakpoint];
      if (columnValue !== undefined) {
        return columnValue;
      }
    }
    return 1;
  }, [columns, screenSize]);

  // 获取当前屏幕尺寸对应的间距
  const getCurrentSpacing = React.useCallback((): number => {
    if (typeof spacing === "number") {
      return spacing;
    }
    // 按屏幕尺寸从大到小检查，找到第一个匹配的断点
    const breakpoints: BreakPoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];
    const currentIndex = breakpoints.indexOf(screenSize);
    // 从当前断点开始往下查找，找到第一个有定义的值
    for (let i = currentIndex; i < breakpoints.length; i++) {
      const breakpoint = breakpoints[i];
      const spacingValue = (spacing as Partial<Record<BreakPoint, number>>)[breakpoint];
      if (spacingValue !== undefined) {
        return spacingValue;
      }
    }
    return 16;
  }, [spacing, screenSize]);

  const currentColumns = getCurrentColumns();
  const currentSpacing = getCurrentSpacing();

  // Grid容器样式
  const gridStyle: React.CSSProperties = {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
    gap: `${currentSpacing}px`,
    width: "100%",
    ...style,
  };

  return (
    <div style={gridStyle} {...props}>
      {children}
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
