import type { Metadata } from "next";
import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Note Detail | Venomous Notes",
    description: `Detail of note #${id}`,
  };
}

const NoteDetailPageLayout: NamedExoticComponent<PropsWithChildren> = memo(({ children }) => {
  return <>{children}</>;
});

NoteDetailPageLayout.displayName = "NoteDetailPageLayout";
export default NoteDetailPageLayout;
