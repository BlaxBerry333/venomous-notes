"use client";

import { memo } from "react";

import type { IGetNoteOfStoryChaptersListResponse, INoteStoryChapter } from "@/types";

const NoteOfStoryCharacterContent = memo<{
  selectedCharacter: IGetNoteOfStoryChaptersListResponse[number] | null;
  characterContent: INoteStoryChapter | undefined;
  isEditing?: boolean;
}>(({ selectedCharacter, characterContent }) => {
  if (!selectedCharacter || !characterContent) {
    return null;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: characterContent?.content || "" }}
      style={{
        width: "100%",
        flex: 1,
        fontSize: "1.15rem",
        lineHeight: 2,
        padding: "0 16px",
        marginBottom: "60px",
        // whiteSpace: "pre-line",
        // wordBreak: "break-all",
      }}
    />
  );
});

NoteOfStoryCharacterContent.displayName = "NoteOfStoryCharacterContent";
export default NoteOfStoryCharacterContent;
