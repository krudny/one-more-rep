export type ConfirmActionOptions = {
  title: string;
  message: string;
  confirmText: string;
  isDestructive?: boolean;
  onConfirm: () => void;
};
