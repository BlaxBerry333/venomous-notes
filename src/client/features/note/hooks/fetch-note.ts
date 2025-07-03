"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/server/trpc/trpc-client";
import { type INote } from "@/types";

export function useGetNoteList(filter: Partial<INote>) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.note.getNoteList.queryOptions({ ...filter }),
    enabled: Boolean(filter.type),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetNoteById(noteId: INote["id"]) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.note.getNote.queryOptions({ id: noteId }),
    staleTime: 1000 * 60 * 5,
  });
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
