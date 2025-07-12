"use client";

import { memo } from "react";
import { Flex, Text } from "venomous-ui";

import { addNumberLeadingZero } from "@/client/utils/format-number";
import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";

const NoteOfStoryChapterContentTitle = memo(() => {
  const { selectedChapter } = useNoteStroyChapterContext();

  if (!selectedChapter) {
    return null;
  }

  return (
    <Flex sx={{ px: { xs: "8px", lg: 0 } }}>
      {/* chapter number */}
      <Text
        text={`Chapter ${addNumberLeadingZero(selectedChapter.order)}`}
        isTitle
        titleLevel="h5"
        sx={{ color: "#65717b" }}
      />

      {/* chapter title */}
      <Text text={selectedChapter.title} isTitle titleLevel="h4" sx={{ lineHeight: "2.15rem" }} />

      {/* chapter updatedAt */}
      <Text
        text={`Updated At: ${new Date(selectedChapter.updatedAt).toLocaleString()}`}
        isLabel
        textColor="disabled"
        sx={{ lineHeight: "1rem" }}
      />
    </Flex>
  );
});

NoteOfStoryChapterContentTitle.displayName = "NoteOfStoryChapterContentTitle";
export default NoteOfStoryChapterContentTitle;
