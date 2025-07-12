"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { ConfirmModal, useToast } from "venomous-ui";

import { INoteType } from "@/types";
import { useNoteDetailContext } from "../contexts/NoteDetailContext";
import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";
import { useDeleteNote, useDeleteNoteOfStoryChapter } from "../hooks/fetch-note";

const NoteOfStoryChapterDeleteModal = memo<{
  isOpen: boolean;
  closeModal: VoidFunction;
}>(({ isOpen, closeModal }) => {
  const toast = useToast();

  const router = useRouter();

  const { selectedNote } = useNoteDetailContext();
  const { selectedChapter, clearSelectedChapter } = useNoteStroyChapterContext();

  const deleteStoryMutation = useDeleteNote({
    onSuccess: () => toast({ type: "success", title: "Success to delete story" }),
    onError: () => toast({ type: "error", title: "Failed to delete story" }),
  });

  const deleteChapterMutation = useDeleteNoteOfStoryChapter({
    onSuccess: () => toast({ type: "success", title: "Success to delete story chapter" }),
    onError: () => toast({ type: "error", title: "Failed to delete story chapter" }),
  });

  const message = useMemo(
    () => `Are you sure to delete this ${!selectedChapter ? "Story" : `Chapter`} ?`,
    [selectedChapter],
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedNote) {
      return;
    }
    // delete story
    if (!selectedChapter) {
      await deleteStoryMutation.mutateAsync({
        id: selectedNote.id,
        type: selectedNote.type,
      });
      router.replace(`/note/list?type=${INoteType.STORY}`);
      return;
    }
    // delete chapter
    await deleteChapterMutation.mutateAsync({
      storyId: selectedNote.id,
      id: selectedChapter.id,
    });
    closeModal();
    clearSelectedChapter();
  }, [
    deleteStoryMutation,
    deleteChapterMutation,
    selectedNote,
    selectedChapter,
    router,
    closeModal,
    clearSelectedChapter,
  ]);

  const isSubmitting: boolean = deleteStoryMutation.isPending;

  return (
    <ConfirmModal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Delete"
      contentMessage={message}
      isSubmitting={isSubmitting}
      cancelButtonIsDisabled={isSubmitting}
      confirmButtonIsDisabled={isSubmitting}
      onSubmit={handleConfirm}
      confirmButtonText="Delete"
    />
  );
});

NoteOfStoryChapterDeleteModal.displayName = "NoteOfStoryChapterDeleteModal";
export default NoteOfStoryChapterDeleteModal;
