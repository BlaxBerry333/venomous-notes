"use client";

import { createContext, use, useCallback, useEffect, useState } from "react";

import type { IGetNoteOfStoryChaptersListResponse } from "@/types";

type ISelectedChapter = IGetNoteOfStoryChaptersListResponse[number] | null;

export interface INoteStroyChapterContext {
  chapters: IGetNoteOfStoryChaptersListResponse;
  isEmptyChapters: boolean;
  selectedChapter: ISelectedChapter;
  setSelectedChapter: (selected: ISelectedChapter) => void;
  clearSelectedChapter: VoidFunction;
  chapterContent: string | undefined;
}

export const NoteStroyChapterContext = createContext<INoteStroyChapterContext>({
  chapters: [],
  isEmptyChapters: true,
  selectedChapter: null,
  setSelectedChapter: () => {},
  clearSelectedChapter: () => {},
  chapterContent: undefined,
});

export function useNoteStroyChapterContext() {
  const context = use(NoteStroyChapterContext);
  if (!context) {
    throw new Error(
      "useNoteStroyChapterContext must be used within NoteStroyChapterContext Provider",
    );
  }
  return context;
}

export function useSelectedChapter(chapters: IGetNoteOfStoryChaptersListResponse = []) {
  const [selectedChapter, _setSelectedChapter] = useState<ISelectedChapter>(null);

  const clearSelectedChapter = useCallback(() => {
    _setSelectedChapter(null);
  }, []);

  const setSelectedChapter = useCallback((selected: ISelectedChapter) => {
    if (!selected) {
      return;
    }
    _setSelectedChapter(selected);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("chapterId", selected.id);
    currentUrl.searchParams.set("chapterOrder", selected.order.toString());
    window.history.pushState({}, "", currentUrl.toString());
  }, []);

  // init default selected chapter
  useEffect(() => {
    if (!chapters.length) {
      return;
    }
    const url = new URL(window.location.href);
    const chapterId = url.searchParams.get("chapterId");
    const chapterOrder = url.searchParams.get("chapterOrder");
    if (!chapterId) {
      _setSelectedChapter(chapters[0]);
      return;
    }
    const chapter = chapters.find(
      ({ id, order }) => id === chapterId && order === Number(chapterOrder),
    );
    if (chapter) {
      _setSelectedChapter(chapter);
    }
  }, [chapters]);

  return {
    selectedChapter,
    setSelectedChapter,
    clearSelectedChapter,
  };
}
