"use client";

import React from "react";

import type { LayoutContextType } from "./index.types";

const LayoutContextDefaultValue: LayoutContextType = {
  isExpandedSidenav: false,
  setIsExpandedSidenav: () => {},
};

const LayoutContext = React.createContext<LayoutContextType>(LayoutContextDefaultValue);

const LayoutProvider = React.memo<React.PropsWithChildren>(({ children }) => {
  const [isExpandedSidenav, setIsExpandedSidenav] = React.useState<LayoutContextType["isExpandedSidenav"]>(LayoutContextDefaultValue.isExpandedSidenav);

  const memoryValue = React.useMemo<LayoutContextType>(() => ({ isExpandedSidenav, setIsExpandedSidenav }), [isExpandedSidenav, setIsExpandedSidenav]);

  return <LayoutContext value={memoryValue}>{children}</LayoutContext>;
});

LayoutProvider.displayName = "LayoutProvider";
export default LayoutProvider;
