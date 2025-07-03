"use client";

import { memo, useCallback, useEffect } from "react";
import {
  FormUncontrolled,
  FormUncontrolledAction,
  InputUncontrolled,
  useForm,
  useToast,
  zodResolver,
} from "venomous-ui";

import { INoteType, UpdateNoteInputSchema, type IUpdateNoteInputSchema } from "@/types";
import { useUpdateNote } from "../hooks";

const NoteOfMemoUpdateForm = memo<{
  isSubmitting: boolean;
  handleOnReset: VoidFunction;
  noteItemOfMemo: IUpdateNoteInputSchema | null;
}>(({ isSubmitting, handleOnReset, noteItemOfMemo }) => {
  const toast = useToast();

  const form = useNoteOfMemoDetailModalForm({ defaultValues: noteItemOfMemo });

  const updateMutation = useUpdateNote({
    onSuccess: () => toast({ type: "success", title: "Success to update" }),
    onError: () => toast({ type: "error", title: "Failed to update" }),
  });

  const handleUpdate = useCallback(
    async (formValue: IUpdateNoteInputSchema) => {
      await updateMutation.mutateAsync({
        id: formValue.id,
        type: INoteType.MEMO,
        message: formValue.message,
      });
    },
    [updateMutation],
  );

  return (
    <FormUncontrolled
      formInstance={form}
      onSubmit={(formValue) => handleUpdate(formValue)}
      onReset={handleOnReset}
    >
      <InputUncontrolled name="message" fullWidth />

      <FormUncontrolledAction
        cancelButtonText="Cancel"
        submitButtonText="Create"
        isSubmitting={isSubmitting}
      />
    </FormUncontrolled>
  );
});

NoteOfMemoUpdateForm.displayName = "NoteOfMemoUpdateForm";
export default NoteOfMemoUpdateForm;

function useNoteOfMemoDetailModalForm({
  defaultValues,
}: {
  defaultValues: IUpdateNoteInputSchema | null;
}) {
  const form = useForm<IUpdateNoteInputSchema>({
    mode: "all",
    resolver: zodResolver(UpdateNoteInputSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    void form.trigger();
  }, [form]);

  return form;
}
