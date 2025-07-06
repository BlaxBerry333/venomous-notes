import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Flex, Icon, Loading, MenuItem, Paper, Text } from "venomous-ui";

import type { INoteStoryChapter } from "@/types";
import { useNoteDetailContext } from "../contexts/NoteDetailContext";
import {
  useGetNoteOfStoryCharacterContent,
  useGetNoteOfStoryCharactersList,
} from "../hooks/fetch-note";

type SelectedCharacter = Pick<INoteStoryChapter, "id" | "order">;

const formatOrder = (order: number) => (order >= 10 ? `${order}` : `0${order}`);

const NoteOfStoryDetailView = memo(() => {
  const { dataSource } = useNoteDetailContext();

  const { data: characters = [] } = useGetNoteOfStoryCharactersList(
    { storyId: dataSource?.id },
    { enabled: !!dataSource?.id },
  );

  const [character, setCharacter] = useState<SelectedCharacter | null>(null);

  useEffect(() => {
    if (characters.length) {
      setCharacter({ id: characters[0].id, order: characters[0].order });
    }
  }, [characters]);

  const allowRequest = !!dataSource?.id && !!character?.id;
  const { data: characterContent, isLoading: isLoadingCharacterContent } =
    useGetNoteOfStoryCharacterContent(
      { storyId: dataSource?.id, id: character?.id },
      { enabled: allowRequest },
    );

  const handleSelectCharacter = useCallback(
    (selected: SelectedCharacter) => setCharacter(selected),
    [],
  );

  if (!dataSource) return null;

  const currentChar = characters.find((c) => c.id === character?.id);

  return (
    <Flex row gap={0.5} sx={{ height: "100%", alignItems: "stretch" }}>
      {/* Sidebar */}
      <Paper isOutlined isTransparent sx={{ width: 200, overflowY: "scroll" }}>
        <Flex>
          <Text
            text={dataSource?.title || ""}
            isTitle
            titleLevel="h5"
            ellipsis
            sx={{
              my: "8px",
              px: "16px",
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
          {characters.map((item) => (
            <MenuItem
              key={item.id}
              label={`${formatOrder(item.order)}. ${item.title}`}
              clickable
              onClick={() => handleSelectCharacter({ id: item.id, order: item.order })}
              isActive={item.id === character?.id}
              sx={{ width: 1 }}
            />
          ))}
        </Flex>
      </Paper>

      {/* Content Area */}
      <Paper
        isTransparent
        sx={{
          flex: 1,
          overflowY: "scroll",
          py: "16px",
          px: {
            xs: "16px",
            sm: "24px",
          },
        }}
      >
        {isLoadingCharacterContent && <Loading />}

        {!isLoadingCharacterContent && character && (
          <>
            <Text
              text={`Character ${formatOrder(character.order)}`}
              isTitle
              titleLevel="h5"
              textColor="disabled"
            />
            <Text
              text={currentChar?.title || ""}
              isTitle
              titleLevel="h4"
              sx={{ my: "8px", lineHeight: "2.25rem" }}
            />
            <Text
              text={new Date(dataSource.updatedAt || 0).toLocaleString()}
              isLabel
              textColor="disabled"
            />
            <Text
              text={characterContent?.content || ""}
              sx={{
                whiteSpace: "pre-line",
                wordBreak: "break-all",
                lineHeight: 2,
                pt: "16px",
                pb: "64px",
              }}
            />
            <Flex row gap={4} sx={{ justifyContent: "space-between" }}>
              <CharacterNavigationCard
                direction="prev"
                characters={characters}
                currentOrder={character.order}
                onSelect={handleSelectCharacter}
              />
              <CharacterNavigationCard
                direction="next"
                characters={characters}
                currentOrder={character.order}
                onSelect={handleSelectCharacter}
              />
            </Flex>
          </>
        )}
      </Paper>
    </Flex>
  );
});

NoteOfStoryDetailView.displayName = "NoteOfStoryDetailView";
export default NoteOfStoryDetailView;

const CharacterNavigationCard = memo(
  ({
    direction,
    characters,
    currentOrder,
    onSelect,
  }: {
    direction: "prev" | "next";
    characters: Array<Omit<INoteStoryChapter, "content">>;
    currentOrder: number;
    onSelect: (character: SelectedCharacter) => void;
  }) => {
    const delta: number = direction === "prev" ? -1 : 1;
    const targetOrder: number = currentOrder + delta;
    const target = useMemo<Omit<INoteStoryChapter, "content"> | null>(() => {
      return characters.find((c) => c.order === targetOrder) ?? null;
    }, [characters, targetOrder]);

    return (
      <Card
        isOutlined
        clickable
        onClick={() => target && onSelect({ id: target.id, order: target.order })}
        sx={{
          visibility: !target ? "hidden" : "visible",
          width: 1,
          height: "110px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexDirection: direction === "prev" ? "row" : "row-reverse",
          gap: 2,
        }}
      >
        <Flex
          sx={{
            height: 1,
            width: "max-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            width={24}
            icon={
              direction === "prev"
                ? "solar:arrow-left-line-duotone"
                : "solar:arrow-right-line-duotone"
            }
          />
        </Flex>
        <Flex sx={{ flex: 1 }}>
          <Text text={`Character ${formatOrder(targetOrder)}`} textColor="disabled" />
          <Text
            text={target?.title || ""}
            bold
            sx={{
              whiteSpace: "pre-line",
              wordBreak: "break-all",
              lineHeight: "1.25rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
        </Flex>
      </Card>
    );
  },
);
CharacterNavigationCard.displayName = "CharacterNavigationCard";
