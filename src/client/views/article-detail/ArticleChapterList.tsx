"use client";

import React from "react";
import { Portal, Space, Theme, Typography } from "venomous-ui-react/components";
import { useThemeBreakpoint } from "venomous-ui-react/hooks";
import { getColors, TextColors } from "venomous-ui-react/utils";

import { LayoutStyle } from "@/client/ui/layout";
import { SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY } from "@/client/ui/layout/LayoutHeader";
import type { IArticle, IArticleChapter } from "@/types/articles";

const ArticleChapterList = React.memo<{
  article: IArticle;
  chapters: undefined | IArticleChapter[];
  selectedChapterOrder: IArticleChapter["order"];
  setSelectedChapterOrder: (order: IArticleChapter["order"]) => void;
}>(({ article, chapters, selectedChapterOrder, setSelectedChapterOrder }) => {
  const { themeColor } = Theme.useThemeColor();
  const { screenSize } = useThemeBreakpoint();
  const isXs = screenSize === "xs";

  const chapterList = React.useMemo<React.JSX.Element>(
    () => (
      <Space.Flex column>
        {chapters?.map((chapter, index) => {
          const isSelected: boolean = chapter.order === selectedChapterOrder;
          const selectedColor: React.CSSProperties["color"] = isSelected ? getColors(themeColor).light : TextColors.grey;
          const selectedStyle: React.CSSProperties = { color: selectedColor, textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)" };
          return (
            <Space.Flex
              row
              key={chapter.id}
              onClick={() => setSelectedChapterOrder(chapter.order)}
              style={{ justifyContent: "flex-start", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <Typography.Text as="strong" text={(index + 1).toString().padStart(3, "0")} style={{ ...selectedStyle }} />
              <Typography.Title as="h6" text={chapter.title} ellipsis={2} style={{ ...selectedStyle }} />
            </Space.Flex>
          );
        })}
      </Space.Flex>
    ),
    [chapters, selectedChapterOrder, themeColor, setSelectedChapterOrder],
  );

  if (isXs) {
    return (
      <Portal.Render targetElementID={SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY}>
        {/* article.title */}
        <Typography.Title as="h4" text={article.title} style={{ lineHeight: 1, textAlign: "left", marginBottom: "40px" }} />
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
        borderRight: `1px solid rgba(255, 255, 255, 0.1)`,
        padding: "16px",
      }}
    >
      {/* article.title */}
      <Typography.Title as="h4" text={article.title} style={{ lineHeight: 1, textAlign: "left", marginBottom: "40px" }} />
      {/* chapters */}
      {chapterList}
    </aside>
  );
});

ArticleChapterList.displayName = "ArticleDetailView";
export default ArticleChapterList;
