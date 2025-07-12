"use client";

import { memo, useEffect } from "react";
import { Button, Flex, FormUncontrolled, InputUncontrolled, useForm } from "venomous-ui";

import type { INoteOfStory, INoteStoryChapter } from "@/types";

type FormValue = Partial<{
  title: INoteOfStory["title"];
  chapter: Pick<INoteStoryChapter, "title" | "content">;
}>;

const NoteOfStoryChapterEditorModalForm = memo<{
  defaultValues: FormValue;
  isSubmitting: boolean;
  handleSubmit: (formValue: FormValue) => Promise<void>;
  handleCancel: VoidFunction;
}>(({ defaultValues, isSubmitting, handleSubmit, handleCancel }) => {
  const form = useForm<FormValue>({
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  return (
    <FormUncontrolled
      formInstance={form}
      onSubmit={handleSubmit}
      onReset={handleCancel}
      width="100%"
    >
      <Flex>
        <InputUncontrolled
          name="title"
          label="Story Title"
          fullWidth
          sx={{
            fontSize: "1.15rem",
            lineHeight: 2,
            p: 0,
          }}
        />

        <InputUncontrolled
          name="chapter.title"
          label="Chapter Title"
          fullWidth
          sx={{
            fontSize: "1.15rem",
            lineHeight: 2,
            p: 0,
          }}
        />

        <InputUncontrolled
          name="chapter.content"
          label="Chapter Content"
          fullWidth
          multiline
          rows={10}
          sx={{
            fontSize: "1.15rem",
            lineHeight: 2,
            p: 0,
            "& textarea": { px: "16px" },
          }}
        />

        <Flex row sx={{ mt: "8px" }}>
          <Button type="reset" text="Cancel" loading={isSubmitting} isOutlined />
          <Button type="submit" text="Save" loading={isSubmitting} />
        </Flex>
      </Flex>
    </FormUncontrolled>
  );
});

NoteOfStoryChapterEditorModalForm.displayName = "NoteOfStoryChapterEditorModalForm";
export default NoteOfStoryChapterEditorModalForm;
