"use client";

import { lazy, memo, Suspense } from "react";

import { useModal } from "venomous-ui";

const NoteOfStoryChapterContent = lazy(() => import("../components/NoteOfStoryChapterContent"));
const NoteOfStoryChapterEditorModal = lazy(() => import("./NoteOfStoryChapterEditorModal"));
const NoteOfStoryChapterDeleteModal = lazy(() => import("./NoteOfStoryChapterDeleteModal"));
const NoteOfStoryChapterContentTitle = lazy(
  () => import("../components/NoteOfStoryChapterContentTitle"),
);
const NoteOfStoryChapterActionButtons = lazy(
  () => import("../components/NoteOfStoryChapterActionButtons"),
);
const NoteOfStoryChapterNavigation = lazy(
  () => import("../components/NoteOfStoryChapterNavigationCard"),
);

const NoteOfStoryChapter = memo(() => {
  const deleteModalHandler = useModal();
  const createModalHandler = useModal();
  const updateModalHandler = useModal();

  return (
    <Suspense fallback={null}>
      {/* action buttons */}
      <NoteOfStoryChapterActionButtons
        openCreateModal={createModalHandler.openModal}
        openUpdateModal={updateModalHandler.openModal}
        deleteChapter={deleteModalHandler.openModal}
      />

      {/* chapter title */}
      <NoteOfStoryChapterContentTitle />

      {/* chapter content */}
      <NoteOfStoryChapterContent />

      {/*create/update modal */}
      <NoteOfStoryChapterEditorModal
        isCreating={createModalHandler.isOpen}
        isUpdating={updateModalHandler.isOpen}
        isOpenEditor={createModalHandler.isOpen || updateModalHandler.isOpen}
        closeEditor={() => {
          if (createModalHandler.isOpen) createModalHandler.closeModal();
          if (updateModalHandler.isOpen) updateModalHandler.closeModal();
        }}
      />

      {/* delete modal */}
      <NoteOfStoryChapterDeleteModal
        isOpen={deleteModalHandler.isOpen}
        closeModal={deleteModalHandler.closeModal}
      />

      {/* chapter navigation */}
      <NoteOfStoryChapterNavigation />
    </Suspense>
  );
});

NoteOfStoryChapter.displayName = "NoteOfStoryChapter";
export default NoteOfStoryChapter;
