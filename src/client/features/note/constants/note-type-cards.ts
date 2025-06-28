import { INoteType } from "@/types";

export type INoteTypeCardItem = {
  label: string;
  href: string;
  color: string;
  icon: string;
};

export const NOTE_TYPE_CARDS: Array<INoteTypeCardItem> = [
  {
    label: "Memo",
    href: `/note/list?type=${INoteType.MEMO}`,
    color: "#009688",
    icon: "solar:notes-bold-duotone",
  },
  {
    label: "Story",
    href: `/note/list?type=${INoteType.STORY}`,
    color: "#00bcd4",
    icon: "solar:planet-bold-duotone",
  },
  {
    label: "Gallery",
    href: "/note/list?type=GALLERY",
    color: "#90a4ae",
    icon: "solar:gallery-bold-duotone",
  },
  // {
  //   label: "Draft Playground",
  //   href: "/draft",
  //   color: "#ffb300",
  //   icon: "solar:pen-bold-duotone",
  // },
  // {
  //   label: "Collections",
  //   href: "/collections",
  //   color: "#E3D026",
  //   icon: "solar:folder-favourite-bookmark-bold-duotone",
  // },
];
