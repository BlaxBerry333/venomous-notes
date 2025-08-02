"use client";

import Link from "next/link";
import React from "react";

import { Card, Space, Theme, Typography } from "venomous-ui-react/components";
import { getOpacityHex, ThemeColor } from "venomous-ui-react/utils";

const FeaturesCards = [
  { label: "Memo List", href: "/memos", color: ThemeColor.EmeraldMamba },
  { label: "Article List", href: "/articles", color: ThemeColor.GarnetViper },
  { label: "Todo List", href: "/todos", color: ThemeColor.AmberRattlesnake },
  { label: "Foreign Language", href: "/foreign-languages", color: ThemeColor.AlexandriteAnaconda },
];

const FeatureCardStyle = {
  height: 160,
  space: 16,
} as const;

const FeaturesGridCards = React.memo(() => {
  const { isDarkThemeMode } = Theme.useThemeMode();
  const getFeatureColor = React.useCallback(
    (color: string) => {
      const color1 = isDarkThemeMode ? color : getOpacityHex(color, 0.5);
      const color2 = isDarkThemeMode ? getOpacityHex(color, 0.25) : color;
      return `linear-gradient(45deg, ${color1} 0%, ${color2} 90%)`;
    },
    [isDarkThemeMode],
  );

  return (
    <Space.Grid
      columns={{
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4,
      }}
      spacing={FeatureCardStyle.space}
      style={{ padding: "16px" }}
    >
      {FeaturesCards.map((feature) => (
        <Link key={feature.label} href={feature.href} scroll>
          <Card
            variant="transparent"
            style={{
              width: "100%",
              height: FeatureCardStyle.height,
              padding: "24px",
              background: getFeatureColor(feature.color),
            }}
          >
            <Space.Flex row>
              <Typography.Title
                text={feature.label}
                as="h5"
                ellipsis={2}
                style={{
                  lineHeight: 1,
                  color: "#FFFFFF",
                  textShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)",
                }}
              />
            </Space.Flex>
          </Card>
        </Link>
      ))}
    </Space.Grid>
  );
});

FeaturesGridCards.displayName = "FeaturesGridCards";
export default FeaturesGridCards;
