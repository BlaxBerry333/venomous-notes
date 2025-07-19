"use client";

import React from "react";
import { Toaster } from "sonner";

import { useThemeMode } from "../../hooks";
import { Icon } from "../Icon";
import { NotificationProps } from "./index.types";

const Notification = React.memo<NotificationProps>(({ position = "top-center", offset = 40, collapsable = false }) => {
  const { isDarkThemeMode } = useThemeMode();
  return (
    <Toaster
      closeButton
      richColors
      invert={isDarkThemeMode}
      visibleToasts={4}
      gap={8}
      position={position}
      offset={offset}
      mobileOffset={offset / 2}
      expand={!collapsable}
      icons={{
        success: <Icon icon="solar:shield-check-line-duotone" color="success" />,
        error: <Icon icon="solar:shield-cross-line-duotone" color="error" />,
        warning: <Icon icon="solar:shield-warning-line-duotone" color="warning" />,
        info: <Icon icon="solar:info-circle-line-duotone" color="info" />,
      }}
    />
  );
});

Notification.displayName = "Notification";
export default Notification;
