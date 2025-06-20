export enum NoteType {
  Memo = "memo",
  Study = "study",
  Gallery = "gallery",
}

/**
 * Memo 备忘录
 */
export type Memo = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Study 学习
 */
export type Study = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Gallery 图库
 */
export type Gallery = {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
