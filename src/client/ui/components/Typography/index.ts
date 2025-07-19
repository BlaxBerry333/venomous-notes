import TypographyCode from "./TypographyCode";
import TypographyParagraph from "./TypographyParagraph";
import TypographyText from "./TypographyText";
import TypographyTitle from "./TypographyTitle";

export { TypographyStyle } from "./index.styles";

export type { TypographyCodeProps, TypographyParagraphProps, TypographyTextProps, TypographyTitleProps } from "./index.types";

export const Typography = {
  Title: TypographyTitle,
  Paragraph: TypographyParagraph,
  Text: TypographyText,
  Code: TypographyCode,
};
