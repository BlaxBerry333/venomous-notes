"use client";

import { memo } from "react";
import { Button, Flex, Tooltip } from "venomous-ui";

const NoteOfStoryCharacterActionButtons = memo<{
  isEditing: boolean;
  toggleNoteEditing: VoidFunction;
  updateNote: VoidFunction;
  deleteNote: VoidFunction;
}>(({ isEditing, toggleNoteEditing, updateNote, deleteNote }) => {
  return (
    <Flex row gap={4} sx={{ width: "100%", justifyContent: "flex-end", px: "16px" }}>
      <Flex row gap={2}>
        {/* Edit & Save */}
        {!isEditing ? (
          <Tooltip tooltip="Edit This Character">
            <Button
              iconWidth={24}
              icon="solar:pen-2-line-duotone"
              isSquare
              onClick={toggleNoteEditing}
            />
          </Tooltip>
        ) : (
          <Tooltip tooltip="Save This Character">
            <Button
              iconWidth={24}
              icon="material-symbols-light:save-rounded"
              isSquare
              onClick={updateNote}
            />
          </Tooltip>
        )}

        {/* Delete */}
        <Tooltip tooltip="Delete This Character">
          <Button
            iconWidth={24}
            icon="solar:trash-bin-2-bold-duotone"
            isSquare
            color="error"
            onClick={deleteNote}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
});

NoteOfStoryCharacterActionButtons.displayName = "NoteOfStoryCharacterActionButtons";
export default NoteOfStoryCharacterActionButtons;
