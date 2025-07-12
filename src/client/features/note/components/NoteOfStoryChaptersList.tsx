"use client";

import { memo, useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { MenuItem, Paper, Text, useThemeBreakpoint } from "venomous-ui";

import { ROOT_HEADER_HEIGHT } from "@/client/common/layout/RootHeader";
import { SETTING_DRAWER_CONTENT_KEY } from "@/client/common/layout/RootHeaderActions";
import { addNumberLeadingZero } from "@/client/utils/format-number";
import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";

type NoteOfStoryChaptersListProps = {
  noteTitle: string;
};

const NoteOfStoryChaptersList = memo<NoteOfStoryChaptersListProps>(({ noteTitle }) => {
  const { isXs, isSm, isMd } = useThemeBreakpoint();
  const showChaptersInDrawer = isXs || isSm || isMd;

  if (showChaptersInDrawer) {
    return (
      <NoteOfStoryChaptersListDrawer>
        <ChaptersListItems noteTitle={noteTitle} />
      </NoteOfStoryChaptersListDrawer>
    );
  }

  return (
    <Paper
      isOutlined
      isTransparent
      sx={{
        width: 300,
        height: `calc(100svh - ${ROOT_HEADER_HEIGHT}px - 16px)`,
        overflowY: "scroll",
        position: "sticky",
        top: `calc(${ROOT_HEADER_HEIGHT}px + 8px)`,
        left: "8px",
        zIndex: 10,
        p: "16px",
      }}
    >
      <ChaptersListItems noteTitle={noteTitle} />
    </Paper>
  );
});

NoteOfStoryChaptersList.displayName = "NoteOfStoryChaptersList";
export default NoteOfStoryChaptersList;

// ====================================================================================================
// ====================================================================================================

const NoteOfStoryChaptersListDrawer = memo<PropsWithChildren>(({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const targetContainer = document.getElementById(SETTING_DRAWER_CONTENT_KEY);
    if (targetContainer) setContainer(targetContainer);
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(<>{children}</>, container, SETTING_DRAWER_CONTENT_KEY);
});

NoteOfStoryChaptersListDrawer.displayName = "NoteOfStoryChaptersListDrawer";

// ====================================================================================================
// ====================================================================================================

const ChaptersListItems = memo<NoteOfStoryChaptersListProps>(({ noteTitle }) => {
  const { chapters, isEmptyChapters, selectedChapter, setSelectedChapter } =
    useNoteStroyChapterContext();

  if (isEmptyChapters) {
    return <Text text="No Chapters, Please Create A New Chapter" />;
  }

  return (
    <>
      <Text
        text={noteTitle}
        isTitle
        titleLevel="h5"
        sx={{
          p: "8px",
          pr: 0,
          minHeight: ROOT_HEADER_HEIGHT - 16,
          // whiteSpace: "pre-line",
          // wordBreak: "break-all",
          // display: "-webkit-box",
          // WebkitLineClamp: 2,
          // WebkitBoxOrient: "vertical",
          // overflow: "hidden",
          // textOverflow: "ellipsis",
          lineHeight: 1.4,
        }}
      />
      {chapters?.map((item) => {
        const isActive: boolean = item.id === selectedChapter?.id;
        return (
          <MenuItem
            key={item.id}
            label={`${addNumberLeadingZero(item.order)}  -  ${item.title}`}
            clickable
            onClick={() => {
              setSelectedChapter(item);
              window.scrollTo(0, 0);
            }}
            isActive={isActive}
            sx={{
              width: 1,
              "& .VenomousUI-Text": {
                mx: "0px",
                my: "8px",
                whiteSpace: "pre-line",
                wordBreak: "break-all",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.25rem",
                fontWeight: isActive ? "550" : "normal",
              },
            }}
          />
        );
      })}
    </>
  );
});

ChaptersListItems.displayName = "ChaptersListItems";
