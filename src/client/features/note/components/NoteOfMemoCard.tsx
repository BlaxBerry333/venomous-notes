"use client";

import { memo } from "react";
import { Button, Card, Text } from "venomous-ui";

import type { INote } from "@/types";

const NoteOfMemoCard = memo<{
  noteItem: INote;
  handleClick: VoidFunction;
  handleClickDelete: VoidFunction;
}>(({ noteItem, handleClick, handleClickDelete }) => {
  if (!noteItem) {
    return null;
  }

  return (
    <Card
      clickable
      onClick={handleClick}
      sx={{
        m: "8px",
        px: "32px",
        width: 1,
        height: "180px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "outline-color 0.2s ease-in-out",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <Button
        isGhost
        isCircle
        icon="solar:close-circle-line-duotone"
        color="error"
        sx={{ position: "absolute", top: "8px", right: "8px" }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleClickDelete();
        }}
      />

      <Text
        text={noteItem.message || ""}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 2,
        }}
      />
    </Card>
  );
});

NoteOfMemoCard.displayName = "NoteOfMemoCard";
export default NoteOfMemoCard;
