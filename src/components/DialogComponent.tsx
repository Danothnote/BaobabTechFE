import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export const DialogComponent = ({
  title,
  visible,
  onHide,
  bodyComponent,
  confirmButtonLabel,
  confirmButtonAction,
  confirmButtonLoading,
  confirmButtonDisabled,
  cancelButtonLabel,
  cancelButtonAction,
}: AddToCartDialogProps) => {
  const footer = (
    <div className="flex justify-content-end gap-4 px-5 pb-5">
      <Button
        label={confirmButtonLabel}
        icon="pi pi-check"
        onClick={confirmButtonAction}
        loading={confirmButtonLoading}
        disabled={confirmButtonDisabled}
      />
      <Button
        label={cancelButtonLabel}
        icon="pi pi-times"
        severity="warning"
        onClick={cancelButtonAction}
      />
    </div>
  );

  return (
    <Dialog
      header={title}
      headerClassName="p-6 text-center"
      visible={visible}
      onHide={onHide}
      footer={footer}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      {bodyComponent}
    </Dialog>
  );
};
