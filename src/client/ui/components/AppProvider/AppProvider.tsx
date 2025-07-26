"use client";

import type { PropsWithChildren } from "react";
import { Notification, Theme } from "venomous-ui-react/components";

import { LayoutStyle } from "@/client/ui/layout";
import { getSystemThemeMode } from "venomous-ui-react/utils";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <Theme.Provider defaultTheme={getSystemThemeMode()}>
      <Theme.InjectToHTML />
      <Notification position="top-right" offset={LayoutStyle.Header.height} />

      {children}
    </Theme.Provider>
  );
}
