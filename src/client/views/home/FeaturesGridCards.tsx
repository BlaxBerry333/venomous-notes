"use client";

import Link from "next/link";
import React, { useCallback } from "react";
import { Card, Space, Theme, Typography } from "venomous-ui-react/components";
import { getColors, ThemeColor } from "venomous-ui-react/utils";

const FeaturesCards = [
  { label: "Memo List", href: "/memos", color: ThemeColor.JadeAnaconda },
  { label: "Article List", href: "/articles", color: ThemeColor.ScarletViper },
  { label: "Todo List", href: "/todos", color: ThemeColor.AmberCobra },
  { label: "Foreign Language", href: "/foreign-languages", color: ThemeColor.AmethystRattlesnake },
];

const FeatureCardStyle = {
  height: 160,
  margin: 16,
} as const;

const FeaturesGridCards = React.memo(() => {
  const { isDarkThemeMode } = Theme.useThemeMode();
  const getFeatureColor = useCallback(
    (color: string) => {
      const color1 = isDarkThemeMode ? getColors(color).dark : getColors(color).origin;
      const color2 = isDarkThemeMode ? getColors(color).light : getColors(color).opacity;
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
        lg: 3,
        xl: 4,
      }}
      spacing={{
        xs: FeatureCardStyle.margin,
        sm: FeatureCardStyle.margin,
        md: FeatureCardStyle.margin,
        lg: FeatureCardStyle.margin,
        xl: FeatureCardStyle.margin,
      }}
      style={{
        padding: "16px",
      }}
    >
      {FeaturesCards.map((feature) => (
        <Link key={feature.label} href={feature.href} scroll>
          <Card
            isTransparent
            style={{
              width: "100%",
              height: FeatureCardStyle.height,
              padding: "16px 24px",
              background: getFeatureColor(feature.color),
            }}
          >
            <Space.Flex row>
              <Typography.Title
                text={feature.label}
                as="h4"
                color="white"
                ellipsis={2}
                style={{
                  lineHeight: 1,
                  textShadow: "4px 2px 8px rgba(0, 0, 0, 0.5)",
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
