import { ulid } from "ulid";
import { NoteTypeEnum, type INote } from "./schema";

export const MOCK_NOTE_LIST: INote[] = [
  {
    id: ulid(),
    type: NoteTypeEnum.Draft,
    title: "Draft1",
    createdAt: new Date().toString(),
  },
  {
    id: ulid(),
    type: NoteTypeEnum.Language,
    title: "Language2",
    createdAt: new Date().toString(),
  },
  {
    id: ulid(),
    type: NoteTypeEnum.Draft,
    title: "Draft3",
    createdAt: new Date().toString(),
  },
];
