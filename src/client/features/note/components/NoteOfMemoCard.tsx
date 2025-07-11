"use client";

import { memo } from "react";
import { Button, Card, Text } from "venomous-ui";

import { INoteType, type INote } from "@/types";

const NoteOfMemoCard = memo<{
  height: string;
  margin: string;
  noteItem: INote;
  handleClick: VoidFunction;
  handleClickDelete: VoidFunction;
}>(({ height, margin, noteItem, handleClick, handleClickDelete }) => {
  if (!noteItem || noteItem.type !== INoteType.MEMO) {
    return null;
  }

  return (
    <Card
      clickable
      onClick={handleClick}
      sx={{
        margin,
        px: "32px",
        width: "100%",
        height,
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
