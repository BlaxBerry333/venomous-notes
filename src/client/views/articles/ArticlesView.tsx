"use client";

import React from "react";
import { Progress, Typography } from "venomous-ui-react/components";

import { useGetArticleListByUserId } from "@/client/hooks/use-request-article";
import { Layout } from "@/client/ui/layout";
import ArticleCreate from "./ArticleCreate";
import ArticlesGridCards from "./ArticlesGridCards";

const ArticlesView = React.memo(() => {
  const { data, isLoading } = useGetArticleListByUserId();

  if (isLoading) {
    return (
      <Layout.Result>
        <Progress.LoadingBar />
      </Layout.Result>
    );
  }

  if (!data?.length) {
    return (
      <Layout.Result>
        <Typography.Title text="No Article Detail" as="h2" style={{ textAlign: "center" }} />
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
