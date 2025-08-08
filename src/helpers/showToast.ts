import type { Toast } from "primereact/toast";
import type { RefObject } from "react";

export const showToast = (
  toast: RefObject<Toast | null>,
  severity:
    | "success"
    | "info"
    | "warn"
    | "error"
    | "secondary"
    | "contrast"
    | undefined,
  summary: string,
  detail: string
) => {
  if (toast.current) {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }
};
