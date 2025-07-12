"use client";

import { memo } from "react";
import { Button, Flex, Tooltip } from "venomous-ui";
import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";

const NoteOfStoryChaptersActionButtons = memo<{
  openCreateModal: VoidFunction;
  openUpdateModal: VoidFunction;
  deleteChapter: VoidFunction;
}>(({ openCreateModal, openUpdateModal, deleteChapter }) => {
  const { selectedChapter } = useNoteStroyChapterContext();

  return (
    <Flex
      row
      sx={{
        width: 1,
        px: { xs: "8px", lg: 0, justifyContent: "space-between" },
      }}
    >
      <Flex row>
        {/* Create */}
        <Tooltip tooltip="Create New Chapter">
          <Button
            iconWidth={24}
            icon="solar:add-circle-line-duotone"
            isSquare
            onClick={openCreateModal}
          />
        </Tooltip>
      </Flex>

      <Flex row sx={{ justifyContent: "flex-end" }}>
        {/* open Editor */}
        {!!selectedChapter && (
          <Tooltip tooltip="Edit This Chapter">
            <Button
              iconWidth={24}
              icon="solar:pen-2-line-duotone"
              isSquare
              onClick={openUpdateModal}
            />
          </Tooltip>
        )}

        {/* Delete */}
        <Tooltip tooltip="Delete This Chapter">
          <Button
            iconWidth={24}
            icon="solar:trash-bin-2-bold-duotone"
            isSquare
            color="error"
            onClick={deleteChapter}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
});

NoteOfStoryChaptersActionButtons.displayName = "NoteOfStoryChaptersActionButtons";
export default NoteOfStoryChaptersActionButtons;
