"use client";

import React from "react";
import { Progress, Space, Typography } from "venomous-ui-react/components";
import { TypographySize } from "venomous-ui-react/utils";

import { Layout } from "@/client/ui";
import type { IArticleChapter } from "@/types/articles";

const ArticleChapterDetail = React.memo<{
  chapter: undefined | IArticleChapter;
  isLoading: boolean;
}>(({ chapter, isLoading }) => {
  if (isLoading) {
    return (
      <Layout.Result>
        <Progress.LoadingBar />
      </Layout.Result>
    );
  }

  if (!chapter) {
    return (
      <Layout.Result>
        <Typography.Title text="No Article Chapter" as="h2" />
        <Typography.Title text="Please create a new chapter first." as="h5" />
      </Layout.Result>
    );
  }

  return (
    <Space.Flex
      column
      style={{
        flex: 1,
        width: "100%",
        minHeight: "100svh",
        overflowY: "scroll",
        padding: "16px 16px 60px",
      }}
    >
      <Progress.Scrollbar />

      {/* Placeholder */}
      <Space.Flex>
        {/* chapter.updatedAt */}
        {chapter.updatedAt && <Typography.Text as="small" text={new Date(chapter.updatedAt).toLocaleString()} />}
      </Space.Flex>

      {/* chapter.title */}
      <Typography.Title as="h3" text={chapter.title} style={{ lineHeight: 1, textAlign: "left", margin: "16px 0 40px" }} />

      {/* chapter.content */}
      <Typography.Paragraph style={{ fontSize: TypographySize.h5, lineHeight: 2 }}>{chapter.content}</Typography.Paragraph>
    </Space.Flex>
  );
});

ArticleChapterDetail.displayName = "ArticleChapterDetail";
export default ArticleChapterDetail;
