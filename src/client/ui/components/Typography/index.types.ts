import { TextColors } from "../../utils";

export interface TypographyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // <h1~h6>
  color?: keyof typeof TextColors;
  ellipsis?: number; // 行数
}

export interface TypographyParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  color?: keyof typeof TextColors;
  ellipsis?: number; // 行数
  bold?: boolean; // font-weight
}

export interface TypographyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  color?: keyof typeof TextColors;
  strong?: boolean; // <strong>
  small?: boolean; // <small>
}

export interface TypographyCodeProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
}
