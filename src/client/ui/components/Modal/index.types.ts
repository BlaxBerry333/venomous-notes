export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;

  maskClosable?: boolean; // 是否允许点击遮罩关闭
}
