import type { Metadata } from "next";
import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Note List | Venomous Notes",
  description: "...",
};

const NoteListPageLayout: NamedExoticComponent<PropsWithChildren> = memo(({ children }) => {
  return <>{children}</>;
});

NoteListPageLayout.displayName = "NoteListPageLayout";
export default NoteListPageLayout;
