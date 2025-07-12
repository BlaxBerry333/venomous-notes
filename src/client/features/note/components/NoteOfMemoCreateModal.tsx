"use client";

import { memo, useCallback, useEffect } from "react";
import {
  Flex,
  FormUncontrolled,
  FormUncontrolledAction,
  InputUncontrolled,
  Modal,
  useForm,
  useModal,
  useToast,
  zodResolver,
} from "venomous-ui";

import { CreateNoteInputSchema, INoteType, type ICreateNoteInputSchema } from "@/types";
import { useCreateNote } from "../hooks";

const NoteOfMemoCreateModal = memo<{
  modalHandler: ReturnType<typeof useModal>;
}>(({ modalHandler }) => {
  const toast = useToast();
  const form = useNoteOfMemoCreateModalForm();

  const createMutation = useCreateNote({
    onSuccess: () => toast({ type: "success", title: "Success to create" }),
    onError: () => toast({ type: "error", title: "Failed to create" }),
  });

  const handleCreate = useCallback(
    async (formValue: ICreateNoteInputSchema) => {
      await createMutation.mutateAsync({
        type: INoteType.MEMO,
        message: formValue.message,
      });
      modalHandler.closeModal();
    },
    [createMutation, modalHandler],
  );

  return (
    <Modal
      isOpen={modalHandler.isOpen}
      closeModal={modalHandler.closeModal}
      isPrevented
      maxWidth="md"
    >
      <FormUncontrolled
        formInstance={form}
        onSubmit={(formValue) => void handleCreate(formValue)}
        onReset={modalHandler.closeModal}
      >
        <Flex sx={{ minHeight: "300px" }}>
          <InputUncontrolled
            name="message"
            fullWidth
            multiline
            rows={8}
            sx={{ p: "8px", typography: "body1", lineHeight: 2 }}
          />

          <FormUncontrolledAction
            cancelButtonText="Cancel"
            submitButtonText="Create"
            isSubmitting={createMutation.isPending}
          />
        </Flex>
      </FormUncontrolled>
    </Modal>
  );
});

NoteOfMemoCreateModal.displayName = "NoteOfMemoCreateModal";
export default NoteOfMemoCreateModal;

function useNoteOfMemoCreateModalForm() {
  const form = useForm<ICreateNoteInputSchema>({
    mode: "all",
    resolver: zodResolver(CreateNoteInputSchema),
    defaultValues: {
      type: INoteType.MEMO,
      message: "",
    },
  });

  useEffect(() => {
    void form.trigger();
  }, [form]);

  return form;
}
