"use client";

import { useCallback, useState, useTransition } from "react";

export default function useNoteToggleEdit() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isTransitioning, startTransition] = useTransition();

  const toggleEditing = useCallback(() => {
    startTransition(() => setIsEditing((s) => !s));
  }, [startTransition]);

  const setEditing = useCallback(
    (state: boolean) => {
      startTransition(() => setIsEditing(state));
    },
    [startTransition],
  );

  return {
    isEditing: isEditing,
    isTransitioningEditing: isTransitioning,
    toggleEditing,
    setEditing,
  };
}
