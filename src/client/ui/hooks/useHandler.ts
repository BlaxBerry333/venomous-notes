import React from "react";

export default function useHandler() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const open = React.useCallback(() => setIsOpen(true), []);

  const close = React.useCallback(() => setIsOpen(false), []);

  const toggle = React.useCallback(() => setIsOpen((s) => !s), []);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  };
}
