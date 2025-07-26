"use client";

import React, { useCallback } from "react";
import { Button, notify } from "venomous-ui-react/components";

import { useCreateArticleByUserId } from "@/client/hooks/use-request-article";

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

  return <Button variant="contained" text="create article" isLoading={createArticleMutation.isPending} onClick={handleCreateArticle} />;
});

ArticleCreate.displayName = "ArticleCreate";
export default ArticleCreate;
