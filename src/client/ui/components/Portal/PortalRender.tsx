"use client";

import React from "react";
import { createPortal } from "react-dom";

import { PortalRenderProps } from "./index.types";

const PortalRender = React.memo<PortalRenderProps>(({ children, targetElementID }) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const targetContainer = document.getElementById(targetElementID);
    if (targetContainer) setContainer(targetContainer);
  }, [targetElementID]);

  if (!container) {
    return null;
  }

  return createPortal(<>{children}</>, container, targetElementID);
});

PortalRender.displayName = "PortalRender";
export default PortalRender;
