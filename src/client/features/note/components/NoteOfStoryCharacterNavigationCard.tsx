"use client";

import { memo, useMemo } from "react";
import { Card, Flex, Icon, Text } from "venomous-ui";

import { addNumberLeadingZero } from "@/client/utils/format-number";
import type { IGetNoteOfStoryChaptersListResponse, INoteStoryChapter } from "@/types";

enum Navigation {
  Prev = "prev",
  Next = "next",
}

type NavigationCardProps = {
  characters: Array<Omit<INoteStoryChapter, "content">>;
  currentCharacterOrder: number;
  direction: Navigation;
  onClick: (character: IGetNoteOfStoryChaptersListResponse[number]) => void;
};

type NoteOfStoryCharacterNavigationProps = {
  characters: NavigationCardProps["characters"];
  currentCharacterOrder?: NavigationCardProps["currentCharacterOrder"];
  handleSelectCharacter: (character: IGetNoteOfStoryChaptersListResponse[number]) => void;
};

const NoteOfStoryCharacterNavigation = memo<NoteOfStoryCharacterNavigationProps>(
  ({ characters, currentCharacterOrder = 1, handleSelectCharacter }) => {
    return (
      <Flex
        sx={{
          gap: { xs: 1, sm: 2, md: 4 },
          width: 1,
          px: "16px",
          mt: "16px",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
        }}
      >
        <NavigationCard
          direction={Navigation.Prev}
          characters={characters}
          currentCharacterOrder={currentCharacterOrder}
          onClick={handleSelectCharacter}
        />

        <NavigationCard
          direction={Navigation.Next}
          characters={characters}
          currentCharacterOrder={currentCharacterOrder}
          onClick={handleSelectCharacter}
        />
      </Flex>
    );
  },
);

NoteOfStoryCharacterNavigation.displayName = "NoteOfStoryCharacterNavigation";
export default NoteOfStoryCharacterNavigation;

const NavigationCard = memo<NavigationCardProps>(
  ({ direction, characters, currentCharacterOrder, onClick }) => {
    const delta: number = direction === Navigation.Prev ? -1 : 1;
    const targetOrder: number = currentCharacterOrder + delta;

    const characterMapByOrder = useMemo(() => {
      return new Map(characters.map((c) => [c.order, c]));
    }, [characters]);
    const target = characterMapByOrder.get(targetOrder) || null;

    return (
      <Card
        isOutlined
        isTransparent
        clickable
        disabled={!target}
        onClick={() => target && onClick(target)}
        sx={{
          width: 1,
          height: "110px",
          visibility: !target ? "hidden" : "visible",
          display: {
            xs: targetOrder === 0 ? "none" : "flex",
            sm: "flex",
          },
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexDirection: direction === Navigation.Prev ? "row" : "row-reverse",
          gap: { xs: 1, sm: 2, md: 4 },
          // transition: "color 0.2s ease-in-out",
          // "&:hover": { color: ({ palette }) => palette.primary.main },
        }}
      >
        <Icon
          width={24}
          icon={
            direction === "prev"
              ? "solar:arrow-left-line-duotone"
              : "solar:arrow-right-line-duotone"
          }
          sx={{ alignSelf: "center" }}
        />

        <Flex gap={0.5} sx={{ flex: 1 }}>
          <Text
            text={`Character ${addNumberLeadingZero(targetOrder)}`}
            textColor="disabled"
            sx={{ width: "100%", textAlign: direction === Navigation.Prev ? "left" : "right" }}
          />
          <Text
            text={target?.title || ""}
            bold
            sx={{
              width: "100%",
              textAlign: direction === Navigation.Prev ? "left" : "right",
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

NavigationCard.displayName = "NavigationCard";
