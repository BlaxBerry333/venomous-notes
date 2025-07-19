"use client";

import React, { useCallback } from "react";

import { Card, Flex, Grid, ThemeColor, Typography } from "@/client/ui/components";
import { useThemeMode } from "@/client/ui/hooks";
import { getColors } from "@/client/ui/utils";
import Link from "next/link";

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
  const { isDarkThemeMode } = useThemeMode();
  const getFeatureColor = useCallback(
    (color: string) => {
      const color1 = isDarkThemeMode ? getColors(color).dark : getColors(color).origin;
      const color2 = isDarkThemeMode ? getColors(color).light : getColors(color).opacity;
      return `linear-gradient(45deg, ${color1} 0%, ${color2} 90%)`;
    },
    [isDarkThemeMode],
  );

  return (
    <Grid
      columns={{
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
      }}
      spacing={{
        xs: FeatureCardStyle.margin,
        sm: FeatureCardStyle.margin,
        md: FeatureCardStyle.margin,
        lg: FeatureCardStyle.margin,
      }}
      style={{
        padding: "0px 16px",
      }}
    >
      {FeaturesCards.map((feature) => (
        <Link key={feature.label} href={feature.href} scroll style={{}}>
          <Card
            style={{
              width: "100%",
              height: FeatureCardStyle.height,
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              color: "#ffffff",
              background: getFeatureColor(feature.color),
            }}
          >
            <Flex row>
              <Typography.Title
                text={feature.label}
                level="h4"
                ellipsis={2}
                style={{
                  lineHeight: 1,
                  color: "#ffffff",
                  textShadow: "4px 2px 8px rgba(0, 0, 0, 0.5)",
                }}
              />
            </Flex>
          </Card>
        </Link>
      ))}
    </Grid>
  );
});

FeaturesGridCards.displayName = "FeaturesGridCards";
export default FeaturesGridCards;
