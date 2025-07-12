"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "@/server/trpc/trpc-client";
import {
  type IGetNoteInputSchema,
  type IGetNoteListInputSchema,
  type IGetNoteOfStoryChapterContentInputSchema,
  type IGetNoteOfStoryChaptersListInputSchema,
  type INote,
  type INoteStoryChapter,
} from "@/types";

type CommonQueryOptions = {
  enabled?: boolean;
};

type CommonMutationCallback = {
  onSuccess: VoidFunction;
  onError: VoidFunction;
};

export function useGetNoteList(
  filter: Partial<IGetNoteListInputSchema>,
  { enabled = true }: CommonQueryOptions = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNoteList.queryOptions({ ...filter }),
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
  });
  const data = useMemo(() => (query.data as unknown as INote[]) || [], [query.data]);
  const isEmpty = useMemo(() => !query.isLoading && !data.length, [query.isLoading, data.length]);

  return {
    ...query,
    data,
    isEmpty,
  };
}

export function useGetNote(
  { id, type }: IGetNoteInputSchema,
  { enabled = true }: CommonQueryOptions = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNote.queryOptions({ id, type }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
  const data = useMemo(() => (query.data as unknown as INote) || null, [query.data]);

  return {
    ...query,
    data,
  };
}

export function useCreateNote(callback: CommonMutationCallback) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.createNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteList.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useUpdateNote(callback: CommonMutationCallback) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.updateNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteList.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNote.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChaptersList.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChapter.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useDeleteNote(callback: CommonMutationCallback) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.deleteNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteList.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useGetNoteOfStoryChaptersList(
  filter: Partial<IGetNoteOfStoryChaptersListInputSchema>,
  { enabled = true }: CommonQueryOptions = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNoteStoryChaptersList.queryOptions({
      ...filter,
      storyId: filter.storyId || "",
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
  const data = useMemo(() => (query.data as unknown as INoteStoryChapter[]) || [], [query.data]);
  const isEmpty = useMemo(() => !query.isLoading && !data.length, [query.isLoading, data.length]);

  return {
    ...query,
    data,
    isEmpty,
  };
}

export function useGetNoteOfStoryChapter(
  filter: Partial<IGetNoteOfStoryChapterContentInputSchema>,
  { enabled = true }: CommonQueryOptions = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNoteStoryChapter.queryOptions({
      ...filter,
      storyId: filter.storyId || "",
      id: filter.id || "",
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
  return {
    ...query,
    isEmpty: !query.isLoading && !query.data,
  };
}

export function useCreateNoteOfStoryChapter(callback: CommonMutationCallback) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.createNoteStoryChapter.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChaptersList.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useUpdateNoteOfStoryChapter(callback: CommonMutationCallback) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.updateNoteStoryChapter.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChaptersList.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChapter.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteList.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNote.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useDeleteNoteOfStoryChapter(callback: CommonMutationCallback) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.deleteNoteStoryChapter.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChaptersList.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteStoryChapter.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNoteList.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.note.getNote.queryKey(),
        });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}
