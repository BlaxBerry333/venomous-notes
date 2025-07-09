"use client";

import { memo, useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { SETTING_DRAWER_CONTENT_KEY } from "@/client/common/layout/RootHeaderActions";

const NoteOfStoryCharactersListDrawer = memo<PropsWithChildren>(({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const targetContainer = document.getElementById(SETTING_DRAWER_CONTENT_KEY);
    if (targetContainer) setContainer(targetContainer);
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(<>{children}</>, container, SETTING_DRAWER_CONTENT_KEY);
});

NoteOfStoryCharactersListDrawer.displayName = "NoteOfStoryCharactersListDrawer";
export default NoteOfStoryCharactersListDrawer;
