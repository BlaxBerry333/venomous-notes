"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/server/utils/trpc/trpc-client";
import type { IGetArticleByIdInput, IGetArticleChapterByOrderInput, IGetArticleChapterListByArticleIdInput } from "@/types/articles";

/**
 * get article list
 */
export function useGetArticleListByUserId() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.article.getArticleListByUserId.queryOptions(),
  });
}

/**
 * get article
 */
export function useGetArticleById({ input }: { input: IGetArticleByIdInput }) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.article.getArticleById.queryOptions(input),
    enabled: !!input.id,
  });
}

/**
 * get article's chapters list
 */
export function useGetArticleChapterListByArticleId({ input }: { input: IGetArticleChapterListByArticleIdInput }) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.article.getArticleChapterListByArticleId.queryOptions(input),
    enabled: !!input.articleId,
  });
}

/**
 * get article's chapter
 */
export function useGetArticleChapterByOrder({ input }: { input: IGetArticleChapterByOrderInput }) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.article.getArticleChapterByOrder.queryOptions(input),
    enabled: !!input.order,
  });
}

/**
 * create article ( empty chapters )
 */
export function useCreateArticleByUserId({ callback }: { callback: { onSuccess: VoidFunction; onError: (message: string) => void } }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.article.createArticleByUserId.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.article.getArticleListByUserId.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}

/**
 * create article's chapter
 */
export function useCreateArticleChapterByArticleId({ callback }: { callback: { onSuccess: VoidFunction; onError: (message: string) => void } }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.article.createArticleChapterByArticleId.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.article.getArticleChapterListByArticleId.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}

/**
 * update article
 */
export function useUpdateArticleById({ callback }: { callback: { onSuccess: VoidFunction; onError: (message: string) => void } }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.article.updateArticleById.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.article.getArticleListByUserId.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}

/**
 * update article's chapter
 */
export function useUpdateArticleChapterById({ callback }: { callback: { onSuccess: VoidFunction; onError: (message: string) => void } }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.article.updateArticleChapterById.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.article.getArticleChapterListByArticleId.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}

/**
 * delete article
 */
export function useDeleteArticleById({ callback }: { callback: { onSuccess: VoidFunction; onError: (message: string) => void } }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.article.deleteArticleById.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.article.getArticleListByUserId.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}

/**
 * delete article's chapter
 */
export function useDeleteArticleChapterById({ callback }: { callback: { onSuccess: VoidFunction; onError: (message: string) => void } }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.article.deleteArticleChapterById.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.article.getArticleChapterListByArticleId.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: (error) => {
        callback?.onError(error.message);
      },
    }),
  );
}
