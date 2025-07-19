"use client";

import React from "react";

import { useThemeColor } from "../../hooks";
import { getColors } from "../../utils";

export default function useThemeDesignInject() {
  const { themeColor } = useThemeColor();
  const colors = React.useMemo(() => getColors(themeColor), [themeColor]);

  React.useEffect(() => {
    const styleId = "theme-palette-style";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    const css = `
        /* 设置选中文本的样式 */
        ::selection {
          background-color: ${colors.opacity};
          color: white;
        }
  
        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: ${colors.origin};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: ${colors.dark};
        } 
        ::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          transition: opacity 0.5s ease-in-out;
        }
        html {
          scrollbar-color: ${colors.origin} rgba(0, 0, 0, 0.1);
          scrollbar-width: thin;
        }
      `;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = css;

    return () => {
      style?.remove();
    };
  }, [colors]);
}
