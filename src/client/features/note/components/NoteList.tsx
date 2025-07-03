"use client";

import { Button, Card, Flex, Loading, Text } from "venomous-ui";

import { type ICreateNoteInputSchema, type INote, INoteType } from "@/types";

interface Props {
  data: undefined | INote[];
  isLoading: boolean;
  selectedMemoType: undefined | INoteType;
  createMemo: (note: ICreateNoteInputSchema) => Promise<void>;
  deleteMemo: (note: Pick<INote, "id">) => Promise<void>;
}

export default function NoteList({
  data,
  isLoading,
  selectedMemoType,
  createMemo,
  deleteMemo,
}: Props) {
  return (
    <section>
      {!!selectedMemoType && (
        <Flex row justifyContent="space-between">
          <Text text={`${selectedMemoType} ( Total: ${data?.length} )`} />
          <Button
            color="success"
            icon="solar:plus-bold-duotone"
            onClick={() => {
              let data: ICreateNoteInputSchema = {
                type: selectedMemoType,
              };
              if (selectedMemoType === INoteType.MEMO) {
                data = {
                  ...data,
                  message: "xxxx",
                };
              }
              if (selectedMemoType === INoteType.GALLERY) {
                data = {
                  ...data,
                  imgUrls: [
                    "https://blaxberry333.github.io/programming-notes/static/cartoon-images/villain--carnage.webp",
                    "https://blaxberry333.github.io/programming-notes/static/skill-images/database--prisma.png",
                  ],
                };
              }
              if (selectedMemoType === INoteType.STORY) {
                data = {
                  ...data,
                  title: "xxxx",
                  chapters: [
                    { title: "Chapter 1", content: "Content 1", order: 1 },
                    { title: "Chapter 2", content: "Content 2", order: 2 },
                  ],
                };
              }
              createMemo(data);
            }}
            text="Create"
          />
        </Flex>
      )}

      {isLoading && <Loading />}

      {!isLoading && (
        <div>
          {data?.map((note, index) => (
            <Card
              key={note.id}
              isOutlined
              sx={{
                display: "flex",
                alignItems: "center",
                backdropFilter: "blur(10px)",
                mb: "2px",
              }}
            >
              <Button
                isCircle
                isGhost
                color="error"
                icon="solar:trash-bin-minimalistic-bold-duotone"
                onClick={() => deleteMemo({ id: note.id })}
              />
              <Flex gap={0} sx={{ ml: "8px" }}>
                <Text text={`No ${String(index + 1)}`} isLabel />
                <Text text={note.id} isLabel />
              </Flex>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
