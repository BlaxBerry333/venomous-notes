"use client";

import React from "react";
import { Menu, Portal, Space, Theme, Typography } from "venomous-ui-react/components";

import { LayoutStyle } from "@/client/ui/layout";
import { SMALL_LAYOUT_SIDENAV_DRAWER_CONTENT_KEY } from "@/client/ui/layout/LayoutHeader";
import type { IArticle, IArticleChapter } from "@/types/articles";

const ArticleChapterList = React.memo<{
  article: IArticle;
  chapters: undefined | IArticleChapter[];
  selectedChapterOrder: IArticleChapter["order"];
  setSelectedChapterOrder: (order: IArticleChapter["order"]) => void;
}>(({ article, chapters, selectedChapterOrder, setSelectedChapterOrder }) => {
  const { screenSize } = Theme.useThemeBreakpoint();
  const isXs = screenSize === "xs";

  const chapterList = React.useMemo<React.JSX.Element>(() => {
    return (
      <Space.Flex column>
        {chapters?.map((chapter, index) => (
          <Menu.Item
            key={chapter.id}
            text={`${(index + 1).toString().padStart(3, "0")} ${chapter.title}`}
            isActive={chapter.order === selectedChapterOrder}
            onClick={() => setSelectedChapterOrder(chapter.order)}
            style={{ width: "100%", textShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)" }}
          />
        ))}
      </Space.Flex>
    );
  }, [chapters, selectedChapterOrder, setSelectedChapterOrder]);

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
