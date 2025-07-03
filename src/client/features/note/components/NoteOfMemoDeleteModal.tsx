"use client";

import { memo, useCallback } from "react";
import { ConfirmModal, useModal, useToast } from "venomous-ui";

import type { INote } from "@/types";
import { useDeleteNote } from "../hooks";

const NoteOfMemoDeleteModal = memo<{
  modalHandler: ReturnType<typeof useModal>;
  noteItemOfMemo: INote | null;
}>(({ modalHandler, noteItemOfMemo }) => {
  const toast = useToast();

  const deleteMutation = useDeleteNote({
    onSuccess: () => toast({ type: "success", title: "Success to delete" }),
    onError: () => toast({ type: "error", title: "Failed to delete" }),
  });

  const handleDelete = useCallback(async () => {
    if (!noteItemOfMemo?.id) return;
    await deleteMutation.mutateAsync({ id: noteItemOfMemo.id });
  }, [deleteMutation, noteItemOfMemo]);

  if (!noteItemOfMemo) {
    return null;
  }

  return (
    <ConfirmModal
      isOpen={modalHandler.isOpen}
      closeModal={modalHandler.closeModal}
      onSubmit={handleDelete}
      title="Delete"
      contentMessage="Are you sure you want to delete this note?"
      cancelButtonText="Cancel"
      confirmButtonText="Delete"
    />
  );
});

NoteOfMemoDeleteModal.displayName = "NoteOfMemoDeleteModal";
export default NoteOfMemoDeleteModal;
