export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isTransparent?: boolean;
  isFrostedGlass?: boolean;
}

export interface CardsBookProps extends React.PropsWithChildren {
  height: number;
  width: number;
  coverImage: null | string;
  title: string;
}
