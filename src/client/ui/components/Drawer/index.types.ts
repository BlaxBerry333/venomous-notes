export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;

  position?: "left" | "right" | "top" | "bottom";
  width?: number | string;
  height?: number | string;
  maskClosable?: boolean; // 是否允许点击遮罩关闭
  showClose?: boolean; // 是否显示关闭按钮
}
