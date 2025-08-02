"use client";

import React from "react";
import { NoSSR, Notification, Theme } from "venomous-ui-react/components";

import { LayoutStyle } from "@/client/ui/layout";
import { getSystemThemeMode } from "venomous-ui-react/utils";

export default function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <NoSSR>
      <Theme.Provider defaultThemeMode={getSystemThemeMode()}>
        <Theme.InjectToHTML />
        <Notification position="top-right" offset={LayoutStyle.Header.height} />

        {children}
      </Theme.Provider>
    </NoSSR>
  );
}
