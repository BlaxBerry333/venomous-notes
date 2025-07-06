"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/server/trpc/trpc-client";
import {
  type IGetNoteInputSchema,
  type IGetNoteListInputSchema,
  type IGetNoteOfStoryChapterContentInputSchema,
  type IGetNoteOfStoryChaptersListInputSchema,
} from "@/types";

export function useGetNoteList(
  filter: Partial<IGetNoteListInputSchema>,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNoteList.queryOptions({ ...filter }),
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
  });
  return {
    ...query,
    isEmpty: !query.isLoading && !query.data?.length,
  };
}

export function useGetNote(
  { id, type }: IGetNoteInputSchema,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNote.queryOptions({ id, type }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
  return {
    ...query,
    isEmpty: !query.isLoading && !query.data,
  };
}

export function useCreateNote(callback: { onSuccess: VoidFunction; onError: VoidFunction }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.createNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.note.getNoteList.queryKey() });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useUpdateNote(callback: { onSuccess: VoidFunction; onError: VoidFunction }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.updateNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.note.getNoteList.queryKey() });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useDeleteNote(callback: { onSuccess: VoidFunction; onError: VoidFunction }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.deleteNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.note.getNoteList.queryKey() });
        callback?.onSuccess();
      },
      onError: () => {
        callback?.onError();
      },
    }),
  );
}

export function useGetNoteOfStoryCharactersList(
  filter: Partial<IGetNoteOfStoryChaptersListInputSchema>,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNoteStoryCharactersList.queryOptions({
      ...filter,
      storyId: filter.storyId || "",
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
  return {
    ...query,
    isEmpty: !query.isLoading && !query.data?.length,
  };
}

export function useGetNoteOfStoryCharacterContent(
  filter: Partial<IGetNoteOfStoryChapterContentInputSchema>,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const trpc = useTRPC();
  const query = useQuery({
    ...trpc.note.getNoteStoryCharacterContent.queryOptions({
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
