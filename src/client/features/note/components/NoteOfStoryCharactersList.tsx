"use client";

import { type JSX, memo, useMemo } from "react";
import { MenuItem, Paper, Text, useThemeBreakpoint } from "venomous-ui";

import { ROOT_HEADER_HEIGHT } from "@/client/common/layout/RootHeader";
import { addNumberLeadingZero } from "@/client/utils/format-number";
import type { IGetNoteOfStoryChaptersListResponse, INoteStoryChapter } from "@/types";
import NoteOfStoryCharactersListDrawer from "./NoteOfStoryCharactersListDrawer";

type NoteOfStoryCharactersListProps = {
  noteTitle: string;
  characters: Array<Omit<INoteStoryChapter, "content">>;
  selectedCharacter: IGetNoteOfStoryChaptersListResponse[number] | null;
  handleSelectCharacter: (selected: IGetNoteOfStoryChaptersListResponse[number]) => void;
  isLoadingCharacterContent: boolean;
};

const NoteOfStoryCharactersList = memo<NoteOfStoryCharactersListProps>(
  ({
    noteTitle,
    characters,
    selectedCharacter,
    handleSelectCharacter,
    isLoadingCharacterContent,
  }) => {
    const { isXs, isSm, isMd } = useThemeBreakpoint();
    const showCharactersInDrawer = isXs || isSm || isMd;

    const charactersListItems = useMemo<JSX.Element>(
      () => (
        <CharactersListItems
          noteTitle={noteTitle}
          characters={characters}
          selectedCharacter={selectedCharacter}
          handleSelectCharacter={handleSelectCharacter}
          isLoadingCharacterContent={isLoadingCharacterContent}
        />
      ),
      [noteTitle, characters, selectedCharacter, handleSelectCharacter, isLoadingCharacterContent],
    );

    if (showCharactersInDrawer) {
      return (
        <NoteOfStoryCharactersListDrawer>{charactersListItems}</NoteOfStoryCharactersListDrawer>
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
        {charactersListItems}
      </Paper>
    );
  },
);

NoteOfStoryCharactersList.displayName = "NoteOfStoryCharactersList";
export default NoteOfStoryCharactersList;

const CharactersListItems = memo<NoteOfStoryCharactersListProps>(
  ({
    noteTitle,
    characters,
    selectedCharacter,
    handleSelectCharacter,
    isLoadingCharacterContent,
  }) => {
    return (
      <>
        <Text
          text={noteTitle}
          isTitle
          titleLevel="h5"
          ellipsis
          sx={{
            p: "8px",
            pr: 0,
            minHeight: ROOT_HEADER_HEIGHT - 16,
            whiteSpace: "pre-line",
            wordBreak: "break-all",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.25rem",
          }}
        />
        {characters?.map((item) => {
          const isActive: boolean = item.id === selectedCharacter?.id;
          return (
            <MenuItem
              key={item.id}
              label={`${addNumberLeadingZero(item.order)}  -  ${item.title}`}
              clickable
              disabled={isLoadingCharacterContent}
              onClick={() => handleSelectCharacter(item)}
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
  },
);

CharactersListItems.displayName = "CharactersListItems";
