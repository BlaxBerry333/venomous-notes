"use client";

import { memo } from "react";
import { Flex, Text } from "venomous-ui";

import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";

const NoteOfStoryChapterContent = memo(() => {
  const { isEmptyChapters, chapterContent } = useNoteStroyChapterContext();

  return (
    <Flex
      sx={{
        width: "100%",
        flex: chapterContent ? 1 : 0,
        fontSize: "1.15rem",
        lineHeight: 2,
        px: { xs: "8px", lg: 0 },
        mt: "40px",
        mb: "60px",
      }}
    >
      {isEmptyChapters ? (
        <Text text="No Chapters, Please Create A New Chapter" />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: chapterContent || "" }} />
      )}
    </Flex>
  );
});

NoteOfStoryChapterContent.displayName = "NoteOfStoryChapterContent";
export default NoteOfStoryChapterContent;
