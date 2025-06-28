import type { Metadata } from "next";
import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Note Create | Venomous Notes",
  description: "...",
};

const NoteCreatePageLayout: NamedExoticComponent<PropsWithChildren> = memo(({ children }) => {
  return <>{children}</>;
});

NoteCreatePageLayout.displayName = "NoteCreatePageLayout";
export default NoteCreatePageLayout;
