"use client";

import { Grid } from "venomous-ui";

import FeatureCard from "@/client/components/common/FeatureCard";
import type { INoteFeatureItem } from "@/types";

const NAV_ITEMS_FEATURE_CARDS: Array<INoteFeatureItem> = [
  {
    label: "Memo",
    href: "/memo",
    color: "#009688",
    icon: "solar:notes-bold-duotone",
  },
  {
    label: "Study",
    href: "/study",
    color: "#00bcd4",
    icon: "solar:planet-bold-duotone",
  },
  {
    label: "Gallery",
    href: "/gallery",
    color: "#90a4ae",
    icon: "solar:gallery-bold-duotone",
  },
  {
    label: "Draft Playground",
    href: "/draft",
    color: "#ffb300",
    icon: "solar:pen-bold-duotone",
  },
  {
    label: "Collections",
    href: "/collections",
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
      items={NAV_ITEMS_FEATURE_CARDS}
      renderGridItem={(item) => <FeatureCard {...item} />}
    />
  );
}
