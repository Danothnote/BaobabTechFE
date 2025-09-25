interface AddToCartDialogProps {
  title: string;
  visible: boolean;
  onHide: () => void;
  bodyComponent: ReactNode;
  confirmButtonLabel: string;
  confirmButtonAction: () => void;
  confirmButtonLoading: boolean;
  confirmButtonDisabled?: boolean;
  cancelButtonLabel: string;
  cancelButtonAction: () => void;
}