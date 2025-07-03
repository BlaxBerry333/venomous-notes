"use client";

import { memo, useCallback, useState, useTransition } from "react";
import { Button, Flex, Loading, Modal, Text, useModal } from "venomous-ui";

import { type INote } from "@/types";
import NoteOfMemoUpdateForm from "./NoteOfMemoUpdateForm";

const NoteOfMemoDetailModal = memo<{
  modalHandler: ReturnType<typeof useModal>;
  noteItemOfMemo: INote | null;
}>(({ modalHandler, noteItemOfMemo }) => {
  const { isEditing, isToggling, toggleEditing, resetEditing } = useToggleEditing();
  const handleCloseModal = useCallback(async () => {
    modalHandler.closeModal();
    await new Promise((resolve) => setTimeout(resolve, 200));
    resetEditing();
  }, [modalHandler, resetEditing]);

  if (!noteItemOfMemo) {
    return null;
  }

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
        sx={{ position: "absolute", top: "16px", right: "16px" }}
        onClick={toggleEditing}
      />

      <Flex
        gap={2}
        sx={{
          height: "300px",
          p: "16px",
          width: 1,
          overflowY: "scroll",
          "& form": { width: 1 },
        }}
      >
        <Text
          text={new Date(noteItemOfMemo.updatedAt).toLocaleString()}
          isLabel
          textColor="disabled"
        />

        {isToggling && <Loading />}

        {!isToggling && !isEditing && (
          <Text text={noteItemOfMemo.message || ""} sx={{ lineHeight: 2 }} />
        )}

        {!isToggling && isEditing && (
          <NoteOfMemoUpdateForm
            isSubmitting={isToggling}
            handleOnReset={modalHandler.closeModal}
            noteItemOfMemo={noteItemOfMemo}
          />
        )}
      </Flex>
    </Modal>
  );
});

NoteOfMemoDetailModal.displayName = "NoteOfMemoDetailModal";
export default NoteOfMemoDetailModal;

function useToggleEditing() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isToggling, startTransition] = useTransition();
  const toggleEditing = useCallback(() => {
    startTransition(() => setIsEditing((s) => !s));
  }, [startTransition]);
  const resetEditing = useCallback(() => {
    startTransition(() => setIsEditing(false));
  }, [startTransition]);
  return {
    isEditing,
    isToggling,
    toggleEditing,
    resetEditing,
  };
}
