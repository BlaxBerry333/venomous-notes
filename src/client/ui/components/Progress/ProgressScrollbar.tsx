"use client";

import { motion, useScroll } from "motion/react";
import React from "react";

import { useThemeColor } from "../../hooks";
import { getColors } from "../../utils";

const ProgressScrollbar = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const { themeColor } = useThemeColor();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        originX: 0,
        zIndex: 10000,
        backgroundImage: `linear-gradient(to right, ${getColors(themeColor).light}, ${themeColor}, ${getColors(themeColor).opacity})`,
        height: "4px",
        borderRadius: "8px",
      }}
    />
  );
});

ProgressScrollbar.displayName = "ProgressScrollbar";
export default ProgressScrollbar;
