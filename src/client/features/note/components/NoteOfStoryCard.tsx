"use client";

import Link from "next/link";
import { memo } from "react";
import { Card, Flex, Text } from "venomous-ui";

import { type INote } from "@/types";

const getNoteDetailURLOfNoteOfStroy = (note: INote): string => {
  return `/note/${note.id}?type=${note.type}`;
};

const NoteOfStoryCard = memo<{
  noteItem: INote;
  height: string;
  width: string;
  margin: string;
}>(({ noteItem, height, width, margin }) => {
  return (
    <Link
      href={getNoteDetailURLOfNoteOfStroy(noteItem)}
      scroll
      style={{
        width: "100%",
        height: "max-content",
        margin,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        clickable
        sx={{
          height,
          width,
          borderTopRightRadius: "0px !important",
          borderBottomRightRadius: "0px !important",
          p: 0,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "12px",
            backgroundColor: ({ palette: { mode, text } }) =>
              mode === "dark" ? text.primary : "#2e2e2e",
          },
        }}
      >
        {/* title */}
        <Flex
          gap={0}
          sx={{
            position: "absolute",
            top: "32px",
            left: "32px",
            right: "24px",
            zIndex: 1,
          }}
        >
          <Text
            text={noteItem.title!}
            isTitle
            titleLevel="h6"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.45,
            }}
          />
        </Flex>

        {/* description */}
        <Flex
          gap={0}
          sx={{
            position: "absolute",
            bottom: "24px",
            left: "32px",
            right: "24px",
            zIndex: 1,
          }}
        >
          <Text
            text={`Created At: ${new Date(noteItem.createdAt!).toLocaleString()}`}
            isLabel
            textColor="disabled"
            sx={{ lineHeight: "1rem" }}
          />
          <Text
            text={`Total Chapters: ${noteItem?.chapters?.length || 0}`}
            isLabel
            textColor="disabled"
            sx={{ lineHeight: "1rem" }}
          />
        </Flex>
      </Card>
    </Link>
  );
});

NoteOfStoryCard.displayName = "NoteOfStoryCard";
export default NoteOfStoryCard;
