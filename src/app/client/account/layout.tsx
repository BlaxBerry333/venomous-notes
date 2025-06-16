import type { Metadata } from "next";
import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Account | Venomous Notes",
  description: "...",
};

const AccountPageLayout: NamedExoticComponent<PropsWithChildren> = memo(({ children }) => {
  return <>{children}</>;
});

AccountPageLayout.displayName = "AccountPageLayout";
export default AccountPageLayout;
