"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/server/trpc/trpc-client";
import { type INote } from "@/types";

export function useGetNoteList(filter: Partial<INote>) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.note.getNoteList.queryOptions({ ...filter }),
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

export function useCreateNote() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.createNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.note.getNoteList.queryKey() });
      },
    }),
  );
}

export function useUpdateNote() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.updateNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.note.getNoteList.queryKey() });
      },
    }),
  );
}

export function useDeleteNote() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.note.deleteNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.note.getNoteList.queryKey() });
      },
    }),
  );
}
