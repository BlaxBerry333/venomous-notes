export interface NotificationProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  offset?: number; // Offset from the edges of the screen.
  collapsable?: boolean;
}

export type NotifyType = "info" | "error" | "success" | "warning";
