"use client";

import React from "react";

import { useGetArticleListByUserId } from "@/client/hooks/use-request-article";
import { Layout, Loading, Typography } from "@/client/ui/components";
import ArticleCreate from "./ArticleCreate";
import ArticlesGridCards from "./ArticlesGridCards";

const ArticlesView = React.memo(() => {
  const { data, isLoading } = useGetArticleListByUserId();

  if (isLoading) {
    return (
      <Layout.Result>
        <Loading />
      </Layout.Result>
    );
  }

  if (!data?.length) {
    return (
      <Layout.Result>
        <Typography.Title text="No Article Detail" level="h2" style={{ textAlign: "center" }} />
        <ArticleCreate />
      </Layout.Result>
    );
  }

  return (
    <>
      <ArticleCreate />
      <ArticlesGridCards data={data} />
    </>
  );
});

ArticlesView.displayName = "ArticlesView";
export default ArticlesView;
