"use client";

import Link from "next/link";
import { memo, type NamedExoticComponent } from "react";
import { Flex, getColors, Icon, Paper, Text } from "venomous-ui";

import type { INoteTypeCardItem } from "@/client/features/note/constants";

const NoteTypeCard: NamedExoticComponent<{
  item: INoteTypeCardItem;
  margin: string;
  height: string;
}> = memo(({ item, height, margin }) => {
  return (
    <Link
      href={item.href}
      scroll
      style={{
        margin,
        width: "100%",
        height: "max-content",
      }}
    >
      <Paper
        sx={{
          minHeight: height,
          py: "16px",
          px: "24px",
          "&:hover": { boxShadow: 4 },
          background: `linear-gradient(90deg, ${getColors(item.color).light} 0%, ${getColors(item.color).opacity} 100%)`,
        }}
      >
        <Flex row>
          <Text text={item.label} isTitle ellipsis />
          <Icon icon={item.icon} width={24} />
        </Flex>
      </Paper>
    </Link>
  );
});

NoteTypeCard.displayName = "NoteTypeCard";
export default NoteTypeCard;
