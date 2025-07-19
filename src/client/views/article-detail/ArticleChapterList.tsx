"use client";

import React from "react";

import { Flex, LayoutStyle, Portal, Typography } from "@/client/ui/components";
import { SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY } from "@/client/ui/components/Layout/LayoutHeader";
import { useThemeBreakpoint, useThemeColor, useThemeMode } from "@/client/ui/hooks";
import { getColors, TextColors } from "@/client/ui/utils";
import type { IArticle, IArticleChapter } from "@/types/articles";

const ArticleChapterList = React.memo<{
  article: IArticle;
  chapters: undefined | IArticleChapter[];
  selectedChapterOrder: IArticleChapter["order"];
  setSelectedChapterOrder: (order: IArticleChapter["order"]) => void;
}>(({ article, chapters, selectedChapterOrder, setSelectedChapterOrder }) => {
  const { isDarkThemeMode } = useThemeMode();
  const { themeColor } = useThemeColor();
  const { screenSize } = useThemeBreakpoint();
  const isXs = screenSize === "xs";

  const chapterList = React.useMemo<React.JSX.Element>(
    () => (
      <Flex column>
        {chapters?.map((chapter, index) => {
          const isSelected: boolean = chapter.order === selectedChapterOrder;
          const selectedColor: React.CSSProperties["color"] = isSelected ? getColors(themeColor).light : TextColors.secondary;
          const selectedStyle: React.CSSProperties = { color: selectedColor, textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)" };
          return (
            <Flex
              row
              key={chapter.id}
              onClick={() => setSelectedChapterOrder(chapter.order)}
              style={{ justifyContent: "flex-start", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <Typography.Text strong text={(index + 1).toString().padStart(3, "0")} style={{ ...selectedStyle }} />
              <Typography.Title level="h6" text={chapter.title} ellipsis={2} style={{ ...selectedStyle }} />
            </Flex>
          );
        })}
      </Flex>
    ),
    [chapters, selectedChapterOrder, themeColor, setSelectedChapterOrder],
  );

  if (isXs) {
    return (
      <Portal.Render targetElementID={SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY}>
        {/* article.title */}
        <Typography.Title level="h4" text={article.title} style={{ lineHeight: 1, textAlign: "left", marginBottom: "40px" }} />
        {/* chapters */}
        {chapterList}
      </Portal.Render>
    );
  }

  return (
    <aside
      style={{
        position: "sticky",
        top: `${LayoutStyle.Header.height}px`,
        left: 0,
        width: 300,
        height: `calc(100svh - ${LayoutStyle.Header.height}px)`,
        overflowY: "scroll",
        borderRight: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        padding: "16px",
      }}
    >
      {/* article.title */}
      <Typography.Title level="h4" text={article.title} style={{ lineHeight: 1, textAlign: "left", marginBottom: "40px" }} />
      {/* chapters */}
      {chapterList}
    </aside>
  );
});

ArticleChapterList.displayName = "ArticleDetailView";
export default ArticleChapterList;
