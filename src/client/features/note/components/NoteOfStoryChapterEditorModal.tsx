"use client";

import { memo, useCallback } from "react";
import { Modal, useThemeBreakpoint, useToast } from "venomous-ui";

import type { INoteOfStory, INoteStoryChapter } from "@/types";
import { useNoteDetailContext } from "../contexts/NoteDetailContext";
import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";
import {
  useCreateNoteOfStoryChapter,
  useUpdateNote,
  useUpdateNoteOfStoryChapter,
} from "../hooks/fetch-note";
import NoteOfStoryChapterEditorModalForm from "./NoteOfStoryChapterEditorModalForm";

type FormValue = Partial<{
  title: INoteOfStory["title"];
  chapter: Pick<INoteStoryChapter, "title" | "content">;
}>;

const NoteOfStoryChapterEditorModal = memo<{
  isOpenEditor: boolean;
  closeEditor: VoidFunction;
  isCreating: boolean;
  isUpdating: boolean;
}>(({ isOpenEditor, closeEditor, isCreating, isUpdating }) => {
  const toast = useToast();
  const themeBreakpoint = useThemeBreakpoint();

  const { selectedNote } = useNoteDetailContext();
  const { chapters, selectedChapter, chapterContent } = useNoteStroyChapterContext();

  const updateStoryMutation = useUpdateNote({
    onSuccess: () => toast({ type: "success", title: "Success to update story" }),
    onError: () => toast({ type: "error", title: "Failed to update story" }),
  });

  const createChapterContentMutation = useCreateNoteOfStoryChapter({
    onSuccess: () => toast({ type: "success", title: "Success to create story chapter content" }),
    onError: () => toast({ type: "error", title: "Failed to create story chapter content" }),
  });

  const updateChapterContentMutation = useUpdateNoteOfStoryChapter({
    onSuccess: () => toast({ type: "success", title: "Success to update story chapter content" }),
    onError: () => toast({ type: "error", title: "Failed to update story chapter content" }),
  });

  const isSubmitting: boolean =
    createChapterContentMutation.isPending ||
    updateStoryMutation.isPending ||
    updateChapterContentMutation.isPending;

  const handleCancel = useCallback(() => {
    closeEditor();
  }, [closeEditor]);

  const handleSubmit = useCallback(
    async ({ title, chapter }: FormValue) => {
      if (!selectedNote) {
        return;
      }
      // create new chapter
      if (isCreating) {
        await createChapterContentMutation.mutateAsync({
          storyId: selectedNote.id,
          title: chapter?.title,
          content: chapter?.content,
        });
      }

      // update current chapter
      if (isUpdating && selectedChapter) {
        await updateChapterContentMutation.mutateAsync({
          storyId: selectedNote.id,
          id: selectedChapter.id,
          title: chapter?.title,
          content: chapter?.content,
        });
      }

      // update story title
      if (title !== selectedNote.title) {
        await updateStoryMutation.mutateAsync({
          id: selectedNote.id,
          type: selectedNote.type,
          title,
        });
      }

      closeEditor();
    },
    [
      isCreating,
      isUpdating,
      updateStoryMutation,
      createChapterContentMutation,
      updateChapterContentMutation,
      selectedNote,
      selectedChapter,
      closeEditor,
    ],
  );

  return (
    <Modal
      fullScreen={themeBreakpoint.isXs}
      maxWidth="xl"
      isOpen={isOpenEditor}
      closeModal={closeEditor}
      sx={{
        "& form": { flex: 1 },
      }}
    >
      <NoteOfStoryChapterEditorModalForm
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        defaultValues={{
          title: selectedNote?.title ?? "",
          chapter: {
            ...(isCreating
              ? {
                  title: `New Chapter ${chapters.length + 1}`,
                  content: "",
                }
              : {
                  title: selectedChapter?.title ?? "",
                  content: chapterContent ?? "",
                }),
          },
        }}
      />
    </Modal>
  );
});

NoteOfStoryChapterEditorModal.displayName = "NoteOfStoryChapterEditorModal";
export default NoteOfStoryChapterEditorModal;
