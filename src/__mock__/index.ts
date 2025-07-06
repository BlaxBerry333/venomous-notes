/* cSpell:disable */

import { INoteType, type INote } from "@/types";

export const MOCK_LIST_NOTE_OF_STORY = [
  {
    id: "0b2d7508-9e60-4f34-ba56-42a9cbb47efe",
    title: "test",
    type: INoteType.STORY,
    createdAt: new Date(),
    chapters: Array.from({ length: 10 }, (_, i) => ({
      title:
        i !== 0
          ? `TITLE-${i + 1}`
          : "Today is a good day, Where can I get some? But I must explain to you how all this mistaken idea",
      order: i + 1,
      content:
        i !== 0
          ? "xxx".repeat(i + 1)
          : `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.  The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
    })),
  },
  {
    id: crypto.randomUUID(),
    title: "Gatsby.js",
    type: INoteType.STORY,
    createdAt: new Date(),
    chapters: [
      {
        title: "test",
        order: 0,
        content: "",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Generally Speaking - How to use Next.js",
    type: INoteType.STORY,
    createdAt: new Date(),
    chapters: [
      {
        title: "test",
        order: 0,
        content: "",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Django Restful Framework",
    type: INoteType.STORY,
    createdAt: new Date(),
    chapters: [
      {
        title: "test",
        order: 0,
        content: "",
      },
    ],
  },
] as INote[];
