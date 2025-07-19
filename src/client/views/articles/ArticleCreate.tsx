"use client";

import React, { useCallback } from "react";

import { useCreateArticleByUserId } from "@/client/hooks/use-request-article";
import { Button, notify } from "@/client/ui/components";

const ArticleCreate = React.memo(() => {
  const createArticleMutation = useCreateArticleByUserId({
    callback: {
      onSuccess: () => notify({ type: "success", title: "Success create article" }),
      onError: (message) => notify({ type: "error", title: message }),
    },
  });

  const handleCreateArticle = useCallback(() => {
    createArticleMutation.mutateAsync({
      title: "New Article",
      imgUrl: "",
    });
  }, [createArticleMutation]);

  return <Button variant="container" text="create article" isLoading={createArticleMutation.isPending} onClick={handleCreateArticle} />;
});

ArticleCreate.displayName = "ArticleCreate";
export default ArticleCreate;
