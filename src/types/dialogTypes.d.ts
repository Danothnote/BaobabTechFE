interface AddToCartDialogProps {
  title: string;
  visible: boolean;
  onHide: () => void;
  bodyComponent: ReactNode;
  confirmButtonLabel: string;
  confirmButtonAction: () => void;
  confirmButtonLoading: boolean;
  cancelButtonLabel: string;
  cancelButtonAction: () => void;
}