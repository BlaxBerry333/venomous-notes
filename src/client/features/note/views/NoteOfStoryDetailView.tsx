"use client";

import { lazy, memo, Suspense } from "react";
import { Flex, Loading } from "venomous-ui";

import NoteOfStoryChapter from "../components/NoteOfStoryChapter";
import { useNoteDetailContext } from "../contexts/NoteDetailContext";
import { NoteStroyChapterContext, useSelectedChapter } from "../contexts/NoteStroyChapterContext";
import { useGetNoteOfStoryChapter, useGetNoteOfStoryChaptersList } from "../hooks/fetch-note";

const NoteOfStoryChaptersList = lazy(() => import("../components/NoteOfStoryChaptersList"));

const NoteOfStoryDetailView = memo(() => {
  const { selectedNote } = useNoteDetailContext();

  const { data: chapters = [] } = useGetNoteOfStoryChaptersList(
    { storyId: selectedNote?.id },
    { enabled: !!selectedNote?.id },
  );

  const { selectedChapter, setSelectedChapter, clearSelectedChapter } =
    useSelectedChapter(chapters);

  const allowRequestChapterContent: boolean = !!selectedNote?.id && !!selectedChapter?.id;

  const { data: chapter, isLoading: isLoadingChapterContent } = useGetNoteOfStoryChapter(
    { storyId: selectedNote?.id, id: selectedChapter?.id },
    { enabled: allowRequestChapterContent },
  );

  return (
    <NoteStroyChapterContext
      value={{
        chapters,
        isEmptyChapters: !chapters?.length,
        selectedChapter,
        setSelectedChapter,
        chapterContent: chapter?.content,
        clearSelectedChapter,
      }}
    >
      <Flex row gap={0} sx={{ height: "100%", alignItems: "stretch" }}>
        {/* chapters list */}
        <Suspense fallback={null}>
          <NoteOfStoryChaptersList noteTitle={selectedNote?.title || ""} />
        </Suspense>

        {/* chapter */}
        <Flex
          gap={0}
          sx={{
            flex: 1,
            overflowY: "scroll",
            py: "8px",
            px: { xs: 0, lg: "24px" },
            position: "relative",
            minHeight: "100svh",
          }}
        >
          <Suspense fallback={null}>
            {isLoadingChapterContent ? <Loading /> : <NoteOfStoryChapter />}
          </Suspense>
        </Flex>
      </Flex>
    </NoteStroyChapterContext>
  );
});

NoteOfStoryDetailView.displayName = "NoteOfStoryDetailView";
export default NoteOfStoryDetailView;
