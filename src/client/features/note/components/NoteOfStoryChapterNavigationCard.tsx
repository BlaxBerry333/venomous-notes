"use client";

import { memo, useMemo } from "react";
import { Card, Flex, Icon, Text } from "venomous-ui";

import { addNumberLeadingZero } from "@/client/utils/format-number";
import { useNoteStroyChapterContext } from "../contexts/NoteStroyChapterContext";

enum Navigation {
  Prev = "prev",
  Next = "next",
}

const NoteOfStoryChapterNavigation = memo(() => {
  const { isEmptyChapters } = useNoteStroyChapterContext();

  if (isEmptyChapters) {
    return null;
  }

  return (
    <Flex
      sx={{
        gap: { xs: 1, sm: 2, md: 4 },
        width: 1,
        px: { xs: "8px", lg: 0 },
        mt: "16px",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
      }}
    >
      {/* previous */}
      <NavigationCard direction={Navigation.Prev} />
      {/* next */}
      <NavigationCard direction={Navigation.Next} />
    </Flex>
  );
});

NoteOfStoryChapterNavigation.displayName = "NoteOfStoryChapterNavigation";
export default NoteOfStoryChapterNavigation;

const NavigationCard = memo<{
  direction: Navigation;
}>(({ direction }) => {
  const { chapters, selectedChapter, setSelectedChapter } = useNoteStroyChapterContext();
  const currentChapterOrder = selectedChapter?.order || 1;

  const delta: number = direction === Navigation.Prev ? -1 : 1;
  const targetOrder: number = currentChapterOrder + delta;

  const chapterMapByOrder = useMemo(() => {
    return new Map(chapters.map((c) => [c.order, c]));
  }, [chapters]);
  const target = chapterMapByOrder.get(targetOrder) || null;

  return (
    <Card
      isOutlined
      isTransparent
      clickable
      disabled={!target}
      onClick={() => setSelectedChapter(target)}
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
          direction === "prev" ? "solar:arrow-left-line-duotone" : "solar:arrow-right-line-duotone"
        }
        sx={{ alignSelf: "center" }}
      />

      <Flex gap={0.5} sx={{ flex: 1 }}>
        <Text
          text={`Chapter ${addNumberLeadingZero(targetOrder)}`}
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
});

NavigationCard.displayName = "NavigationCard";
