"use client";

import Link from "next/link";
import { Flex, getColors, Grid, Icon, Paper, Text } from "venomous-ui";

const NAV_ITEMS: Array<{
  label: string;
  href: string;
  color: string;
  icon: string;
}> = [
  {
    label: "Memo",
    href: "/client/memo",
    color: "#009688",
    icon: "solar:notes-bold-duotone",
  },
  {
    label: "Study",
    href: "/client/study",
    color: "#00bcd4",
    icon: "solar:planet-bold-duotone",
  },
  {
    label: "Gallery",
    href: "/client/gallery",
    color: "#90a4ae",
    icon: "solar:gallery-bold-duotone",
  },
  {
    label: "Draft Playground",
    href: "/client/draft",
    color: "#ffb300",
    icon: "solar:pen-bold-duotone",
  },
  {
    label: "Collections",
    href: "/client/collections",
    color: "#E3D026",
    icon: "solar:folder-favourite-bookmark-bold-duotone",
  },
];

export default function HomePage() {
  return (
    <Grid
      height="100%"
      width="100%"
      cols={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
      items={NAV_ITEMS}
      renderGridItem={(item) => (
        <div
          style={{
            margin: "16px",
            width: "100%",
            minHeight: "160px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Link href={item.href} scroll>
            <Paper
              sx={{
                height: 1,
                width: 1,
                py: "16px",
                px: "24px",
                backgroundColor: getColors(item.color).opacity,
              }}
            >
              <Flex row>
                <Text text={item.label} isTitle ellipsis />
                <Icon icon={item.icon} width={24} />
              </Flex>
            </Paper>
          </Link>
        </div>
      )}
    />
  );
}
