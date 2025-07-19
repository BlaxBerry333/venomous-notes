import type { Metadata } from "next";

import { ArticleDetailView } from "@/client/views/article-detail";
import React from "react";

export const metadata: Metadata = {
  title: "Article Detail",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function ArticleDetailPage({ params, searchParams }: PageProps) {
  const { id: articleId } = React.use(params);
  const { chapterOrder } = React.use(searchParams);

  return <ArticleDetailView articleId={articleId} chapterOrder={Number(chapterOrder)} />;
}
