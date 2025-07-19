"use client";

import React from "react";

import { Flex, Layout, Loading, Typography, TypographyStyle } from "@/client/ui";
import type { IArticleChapter } from "@/types/articles";

const ArticleChapterDetail = React.memo<{
  chapter: undefined | IArticleChapter;
  isLoading: boolean;
}>(({ chapter, isLoading }) => {
  if (isLoading) {
    return (
      <Layout.Result>
        <Loading />
      </Layout.Result>
    );
  }

  if (!chapter) {
    return (
      <Layout.Result>
        <Typography.Title text="No Article Chapter" level="h2" />
        <Typography.Title text="Please create a new chapter first." level="h5" />
      </Layout.Result>
    );
  }

  return (
    <Flex
      column
      style={{
        flex: 1,
        width: "100%",
        minHeight: "100svh",
        overflowY: "scroll",
        padding: "16px 16px 60px",
      }}
    >
      {/* Placeholder */}
      <Flex>
        {/* chapter.updatedAt */}
        {chapter.updatedAt && <Typography.Text small text={new Date(chapter.updatedAt).toLocaleString()} color="secondary" />}
      </Flex>

      {/* chapter.title */}
      <Typography.Title level="h3" text={chapter.title} style={{ lineHeight: 1, textAlign: "left", margin: "16px 0 40px" }} />

      {/* chapter.content */}
      <Typography.Paragraph text={chapter.content} style={{ fontSize: TypographyStyle.size.h5, lineHeight: 2 }} />
    </Flex>
  );
});

ArticleChapterDetail.displayName = "ArticleChapterDetail";
export default ArticleChapterDetail;
