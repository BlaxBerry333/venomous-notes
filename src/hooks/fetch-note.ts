import type { INote } from "@/utils/trpc/procedures/note/schema";
import { useTRPC } from "@/utils/trpc/trpc-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetNoteList({ type: noteType }: Pick<INote, "type">) {
  const trpc = useTRPC();
  return useQuery(trpc.getNoteList.queryOptions({ type: noteType }));
}

export function useGetNoteById(noteId: INote["id"]) {
  const trpc = useTRPC();
  return useQuery(trpc.getNoteById.queryOptions({ id: noteId }));
}

export function useCreateNote() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.createNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getNoteList.queryKey() });
      },
    }),
  );
}

export function useUpdateNote() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.updateNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getNoteList.queryKey() });
      },
    }),
  );
}

export function useDeleteNote() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.deleteNote.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getNoteList.queryKey() });
      },
    }),
  );
}
