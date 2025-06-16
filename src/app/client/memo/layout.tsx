import type { Metadata } from "next";
import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Memo | Venomous Notes",
  description: "...",
};

const MemoPageLayout: NamedExoticComponent<PropsWithChildren> = memo(({ children }) => {
  return <>{children}</>;
});

MemoPageLayout.displayName = "MemoPageLayout";
export default MemoPageLayout;
