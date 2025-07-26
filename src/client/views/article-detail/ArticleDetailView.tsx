"use client";

import React from "react";
import { notify, Progress, Space, Typography } from "venomous-ui-react/components";

import {
  useCreateArticleChapterByArticleId,
  useGetArticleById,
  useGetArticleChapterByOrder,
  useGetArticleChapterListByArticleId,
} from "@/client/hooks/use-request-article";
import { Layout } from "@/client/ui/layout";
import type { IArticle, IArticleChapter } from "@/types/articles";
import ArticleActionsButtons from "./ArticleActionsButtons";
import ArticleChapterDetail from "./ArticleChapterDetail";
import ArticleChapterList from "./ArticleChapterList";

const ArticleDetailView = React.memo<{
  articleId: IArticle["id"];
  chapterOrder: IArticleChapter["order"];
}>(({ articleId, chapterOrder }) => {
  const [selectedChapterOrder, setSelectedChapterOrder] = React.useState<IArticleChapter["order"]>(1);
  const handleSelectChapterOrder = React.useCallback((order: IArticleChapter["order"]) => {
    setSelectedChapterOrder(order);
    window.scrollTo(0, 0);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("chapterOrder", order.toString());
    window.history.pushState({}, "", currentUrl.toString());
  }, []);

  React.useEffect(() => {
    setSelectedChapterOrder(chapterOrder);
  }, [chapterOrder]);

  const { data: article, isLoading: isLoadingArticle } = useGetArticleById({ input: { id: articleId } });
  const { data: chapters } = useGetArticleChapterListByArticleId({ input: { articleId } });
  const { data: chapter, isLoading: isLoadingChapter } = useGetArticleChapterByOrder({ input: { articleId, order: selectedChapterOrder } });

  const createChapterMutation = useCreateArticleChapterByArticleId({
    callback: {
      onSuccess: () => notify({ type: "success", title: "Create chapter success" }),
      onError: (message) => notify({ type: "error", title: `Failed to create chapter. ${message}` }),
    },
  });
  const handleCreateChapter = React.useCallback(async () => {
    await createChapterMutation.mutateAsync({
      articleId,
      title: `New Chapter`,
      content: new Date().toString(),
    });
  }, [articleId, createChapterMutation]);

  if (isLoadingArticle) {
    return (
      <Layout.Result>
        <Progress.LoadingBar />
      </Layout.Result>
    );
  }

  if (!article) {
    return (
      <Layout.Result>
        <Typography.Title text="No Article Detail" as="h2" />
      </Layout.Result>
    );
  }

  return (
    <Space.Flex row style={{ width: "100%", height: "100%" }}>
      {/* actions buttons */}
      <ArticleActionsButtons handleCreateChapter={handleCreateChapter} />

      {/* chapter list */}
      <ArticleChapterList
        article={article}
        chapters={chapters}
        selectedChapterOrder={selectedChapterOrder}
        setSelectedChapterOrder={handleSelectChapterOrder}
      />

      {/* chapter detail */}
      <ArticleChapterDetail chapter={chapter} isLoading={isLoadingChapter} />
    </Space.Flex>
  );
});

ArticleDetailView.displayName = "ArticleDetailView";
export default ArticleDetailView;
