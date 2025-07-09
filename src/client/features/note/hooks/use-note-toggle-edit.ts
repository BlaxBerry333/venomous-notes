"use client";

import { useCallback, useState, useTransition } from "react";

export default function useNoteToggleEdit() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isTransitioning, startTransition] = useTransition();

  const toggleEditing = useCallback(() => {
    startTransition(() => setIsEditing((s) => !s));
  }, [startTransition]);

  const resetEditing = useCallback(() => {
    startTransition(() => setIsEditing(false));
  }, [startTransition]);

  return {
    isEditing: isEditing,
    isTransitioningEditing: isTransitioning,
    toggleEditing,
    resetEditing,
  };
}
