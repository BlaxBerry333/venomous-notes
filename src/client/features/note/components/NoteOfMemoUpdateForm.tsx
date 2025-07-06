"use client";

import { memo, useEffect } from "react";
import {
  FormUncontrolled,
  FormUncontrolledAction,
  InputUncontrolled,
  useForm,
  zodResolver,
} from "venomous-ui";

import { UpdateNoteInputSchema, type IUpdateNoteInputSchema } from "@/types";

const NoteOfMemoUpdateForm = memo<{
  isSubmitting: boolean;
  handleSubmit: (formValue: IUpdateNoteInputSchema) => Promise<void>;
  handleCancel: VoidFunction;
  defaultValues: IUpdateNoteInputSchema | null;
}>(({ isSubmitting, handleSubmit, handleCancel, defaultValues }) => {
  const form = useNoteOfMemoDetailModalForm({ defaultValues });

  return (
    <FormUncontrolled
      formInstance={form}
      onSubmit={(formValue) => handleSubmit(formValue)}
      onReset={handleCancel}
    >
      <InputUncontrolled
        name="message"
        fullWidth
        multiline
        rows={8}
        sx={{ p: "8px", typography: "body1", lineHeight: 2 }}
      />

      <FormUncontrolledAction
        cancelButtonText="Cancel"
        submitButtonText="Update"
        isSubmitting={isSubmitting}
        sx={{ mt: "8px" }}
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
