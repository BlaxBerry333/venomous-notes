"use client";

import { Grid } from "venomous-ui";

import NoteTypeCard from "@/client/features/note/components/NoteTypeCard";
import { NOTE_TYPE_CARDS } from "@/client/features/note/constants";

export default function HomePage() {
  return (
    <Grid
      height="100%"
      width="100%"
      cols={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
      items={NOTE_TYPE_CARDS}
      renderGridItem={(item) => <NoteTypeCard {...item} />}
    />
  );
}
