import { BreakPointWidth } from "../../utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: Partial<Record<keyof typeof BreakPointWidth, number>>; // 每个断点的列数
  spacing?: Partial<Record<keyof typeof BreakPointWidth, number>>; // 每个断点的间距
}
