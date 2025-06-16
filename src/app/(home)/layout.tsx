import type { Metadata } from "next";
import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Home | Venomous Notes",
  description: "...",
};

const HomePageLayout: NamedExoticComponent<PropsWithChildren> = memo(({ children }) => {
  return <>{children}</>;
});

HomePageLayout.displayName = "HomePageLayout";
export default HomePageLayout;
