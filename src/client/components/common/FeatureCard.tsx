"use client";

import Link from "next/link";
import { memo, type NamedExoticComponent } from "react";
import { Flex, getColors, Icon, Paper, Text } from "venomous-ui";

import type { INoteFeatureItem } from "@/types";

const FeatureCard: NamedExoticComponent<INoteFeatureItem> = memo((item) => {
  return (
    <Link
      href={item.href}
      scroll
      style={{
        width: "100%",
        height: "max-content",
        margin: "16px",
      }}
    >
      <Paper
        sx={{
          minHeight: "160px",
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

FeatureCard.displayName = "FeatureCard";
export default FeatureCard;
