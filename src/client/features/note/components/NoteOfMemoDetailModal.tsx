"use client";

import { memo, useCallback } from "react";
import { Button, Flex, Loading, Modal, Text, useModal, useToast } from "venomous-ui";

import { useGetNote, useNoteToggleEdit, useUpdateNote } from "@/client/features/note/hooks";
import { INoteType, type INote, type IUpdateNoteInputSchema } from "@/types";
import NoteOfMemoUpdateForm from "./NoteOfMemoUpdateForm";

const NoteOfMemoDetailModal = memo<{
  modalHandler: ReturnType<typeof useModal>;
  noteItemOfMemo: INote | null;
}>(({ modalHandler, noteItemOfMemo }) => {
  const { id: noteId, type: noteType } = noteItemOfMemo || {};

  const toast = useToast();
  const { isEditing, setEditing, isTransitioningEditing, toggleEditing } = useNoteToggleEdit();

  const allowRequest: boolean = !!noteId && noteType === INoteType.MEMO;

  const { data, isLoading, error } = useGetNote(
    { id: noteId!, type: noteType as INoteType },
    { enabled: allowRequest },
  );

  const updateMutation = useUpdateNote({
    onSuccess: () => toast({ type: "success", title: "Success to update" }),
    onError: () => toast({ type: "error", title: "Failed to update" }),
  });

  const handleSubmit = useCallback(
    async (formValue: IUpdateNoteInputSchema) => {
      await updateMutation.mutateAsync({
        id: formValue.id,
        type: INoteType.MEMO,
        message: formValue.message,
      });
    },
    [updateMutation],
  );

  const handleCloseModal = useCallback(async () => {
    modalHandler.closeModal();
    await new Promise((resolve) => setTimeout(resolve, 200));
    setEditing(false);
  }, [modalHandler, setEditing]);

  return (
    <Modal
      isOpen={modalHandler.isOpen}
      closeModal={handleCloseModal}
      isPrevented={false}
      maxWidth="md"
    >
      <Button
        isSquare
        icon="solar:pen-2-line-duotone"
        sx={{ position: "absolute", top: "8px", right: "8px" }}
        onClick={toggleEditing}
      />

      <Flex
        sx={{
          width: 1,
          height: "380px",
          overflowY: "scroll",
          "& form": { width: 1 },
        }}
      >
        <Text text={new Date(data?.updatedAt || 0).toLocaleString()} isLabel textColor="disabled" />

        {(isLoading || isTransitioningEditing) && <Loading />}

        {!isLoading && error && <Text text={error?.message || "Note Not Found"} isTitle />}

        {!isLoading && !isTransitioningEditing && (
          <>
            {!isEditing && <Text text={data?.message || ""} sx={{ lineHeight: 2 }} />}

            {isEditing && (
              <NoteOfMemoUpdateForm
                isSubmitting={updateMutation.isPending}
                handleSubmit={handleSubmit}
                handleCancel={handleCloseModal}
                defaultValues={data || null}
              />
            )}
          </>
        )}
      </Flex>
    </Modal>
  );
});

NoteOfMemoDetailModal.displayName = "NoteOfMemoDetailModal";
export default NoteOfMemoDetailModal;
