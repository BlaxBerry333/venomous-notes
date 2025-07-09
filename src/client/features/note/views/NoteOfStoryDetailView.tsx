"use client";

import { lazy, memo, Suspense, useCallback, useEffect, useState } from "react";
import { Flex, Loading, Text } from "venomous-ui";

import { addNumberLeadingZero } from "@/client/utils/format-number";
import type { IGetNoteOfStoryChaptersListResponse } from "@/types";
import { useNoteDetailContext } from "../contexts/NoteDetailContext";
import { useNoteToggleEdit } from "../hooks";
import {
  useGetNoteOfStoryCharacterContent,
  useGetNoteOfStoryCharactersList,
} from "../hooks/fetch-note";

const NoteOfStoryCharactersList = lazy(() => import("../components/NoteOfStoryCharactersList"));
const NoteOfStoryCharacterContent = lazy(() => import("../components/NoteOfStoryCharacterContent"));
const NoteOfStoryCharacterActionButtons = lazy(
  () => import("../components/NoteOfStoryCharacterActionButtons"),
);
const NoteOfStoryDetailCharacterNavigation = lazy(
  () => import("../components/NoteOfStoryCharacterNavigationCard"),
);

const NoteOfStoryDetailView = memo(() => {
  const { selectedNote } = useNoteDetailContext();

  const { data: characters = [] } = useGetNoteOfStoryCharactersList(
    { storyId: selectedNote?.id },
    { enabled: !!selectedNote?.id },
  );

  const { selectedCharacter, handleSelectCharacter } = useSelectedCharacter(characters);
  const { isEditing, toggleEditing, resetEditing } = useNoteToggleEdit();

  const allowRequest = !!selectedNote?.id && !!selectedCharacter?.id;

  const { data: characterContent, isLoading: isLoadingCharacterContent } =
    useGetNoteOfStoryCharacterContent(
      { storyId: selectedNote?.id, id: selectedCharacter?.id },
      { enabled: allowRequest },
    );

  if (!allowRequest) return null;

  return (
    <Flex row gap={0} sx={{ height: "100%", alignItems: "stretch" }}>
      <Suspense fallback={null}>
        <NoteOfStoryCharactersList
          noteTitle={selectedNote?.title || ""}
          characters={characters}
          selectedCharacter={selectedCharacter}
          handleSelectCharacter={handleSelectCharacter}
          isLoadingCharacterContent={isLoadingCharacterContent}
        />
      </Suspense>

      <Flex
        gap={0}
        sx={{
          flex: 1,
          overflowY: "scroll",
          py: "16px",
          px: { xs: 0, lg: "24px" },
          position: "relative",
          minHeight: "100svh",
        }}
      >
        {isLoadingCharacterContent && <Loading />}

        <Text
          text={`Character ${addNumberLeadingZero(selectedCharacter.order)}`}
          isTitle
          titleLevel="h5"
          sx={{ color: "#65717b", px: "16px", mb: "8px" }}
        />
        <Text
          text={characters.find(({ id }) => id === selectedCharacter.id)?.title || ""}
          isTitle
          titleLevel="h4"
          sx={{ lineHeight: "2.15rem", px: "16px", mb: "40px" }}
        />

        {!isLoadingCharacterContent && (
          <Suspense fallback={null}>
            <NoteOfStoryCharacterContent
              selectedCharacter={selectedCharacter}
              characterContent={characterContent}
              isEditing={isEditing}
            />
            <NoteOfStoryCharacterActionButtons
              isEditing={isEditing}
              toggleNoteEditing={toggleEditing}
              updateNote={resetEditing}
              deleteNote={resetEditing}
            />
            <NoteOfStoryDetailCharacterNavigation
              characters={characters}
              currentCharacterOrder={selectedCharacter?.order}
              handleSelectCharacter={handleSelectCharacter}
            />
          </Suspense>
        )}
      </Flex>
    </Flex>
  );
});

NoteOfStoryDetailView.displayName = "NoteOfStoryDetailView";
export default NoteOfStoryDetailView;

function useSelectedCharacter(characters: IGetNoteOfStoryChaptersListResponse = []) {
  const [selectedCharacter, setSelectedCharacter] = useState<
    IGetNoteOfStoryChaptersListResponse[number] | null
  >(null);

  const handleSelectCharacter = useCallback((selected: typeof selectedCharacter) => {
    if (!selected) return;
    setSelectedCharacter(selected);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("characterId", selected.id);
    currentUrl.searchParams.set("characterOrder", selected.order.toString());
    window.history.pushState({}, "", currentUrl.toString());
  }, []);

  // init default selected character
  useEffect(() => {
    if (characters.length && selectedCharacter === null) {
      const url = new URL(window.location.href);
      const characterId = url.searchParams.get("characterId");
      const characterOrder = url.searchParams.get("characterOrder");
      if (!characterId) {
        setSelectedCharacter(characters[0]);
        return;
      }
      const character = characters.find(
        ({ id, order }) => id === characterId && order === Number(characterOrder),
      );
      if (character) setSelectedCharacter(character);
    }
  }, [characters, selectedCharacter]);

  return {
    selectedCharacter,
    handleSelectCharacter,
  };
}
