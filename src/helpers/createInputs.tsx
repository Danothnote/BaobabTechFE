import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import type { CreateInputsProps } from "../types/formTypes";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import {
  FileUpload,
  type FileUploadRemoveEvent,
  type FileUploadSelectEvent,
} from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";

export const createInputs = ({
  input,
  formData,
  errors,
  handleChange,
  isTouched,
  fileUploadRef,
  optionalFieldsEnabled,
  handleOptionalFieldChange,
}: CreateInputsProps) => {
  const shouldShowError = isTouched && errors;
  const isEnabled = !input.optional || optionalFieldsEnabled[input.id];

  const onFileSelect = (event: FileUploadSelectEvent) => {
    handleChange(input.id, event.files);
  };

  const onFileRemove = (event: FileUploadRemoveEvent, inputId: string) => {
    const currentFiles = (formData[inputId] || []) as File[];
    const updatedFiles = currentFiles.filter(
      (file) => file.name !== event.file.name || file.size !== event.file.size
    );
    handleChange(input.id, updatedFiles);
  };

  const renderInputControl = () => {
    switch (input.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <div key={input.id} className="w-full">
            <FloatLabel className={"block m-auto w-11"}>
              <InputText
                invalid={shouldShowError ? true : false}
                className="w-12"
                id={input.id}
                value={(formData[input.id] as string) || ""}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(input.id, e.target.value)
                }
                min={
                  input.min && typeof input.min === "number"
                    ? input.min
                    : undefined
                }
                max={
                  input.max && typeof input.max === "number"
                    ? input.max
                    : undefined
                }
                type={input.type}
                placeholder={input.placeholder}
                keyfilter={
                  input.type === "number"
                    ? "num"
                    : input.type === "email"
                    ? "email"
                    : undefined
                }
                disabled={!isEnabled}
              />
              <label htmlFor={input.id}>{input.label}</label>
            </FloatLabel>
            {shouldShowError && Array.isArray(errors) ? (
              <div>
                {errors.map((error, index) => (
                  <small key={index} className="p-error block">
                    {error}
                  </small>
                ))}
              </div>
            ) : (
              shouldShowError && (
                <small className="p-error block">{errors}</small>
              )
            )}
          </div>
        );
      case "textarea": // Nuevo caso para el textarea
        return (
          <div key={input.id} className="w-full">
            <FloatLabel className={"block m-auto w-11"}>
              <InputTextarea
                invalid={shouldShowError ? true : false}
                className="w-12"
                id={input.id}
                value={(formData[input.id] as string) || ""}
                onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(input.id, e.target.value)
                }
                disabled={!isEnabled}
                autoResize
              />
              <label htmlFor={input.id}>{input.label}</label>
            </FloatLabel>
            {shouldShowError && Array.isArray(errors) ? (
              <div>
                {errors.map((error, index) => (
                  <small key={index} className="p-error block">
                    {error}
                  </small>
                ))}
              </div>
            ) : (
              shouldShowError && (
                <small className="p-error block">{errors}</small>
              )
            )}
          </div>
        );
      case "date":
        return (
          <div key={input.id} className="w-full">
            <FloatLabel className={"block m-auto w-11"}>
              <Calendar
                invalid={shouldShowError ? true : false}
                className="w-12"
                id={input.id}
                value={(formData[input.id] as Date) || null}
                onChange={(e) => handleChange(input.id, e.value)}
                placeholder={input.placeholder}
                minDate={
                  input.min && typeof input.min !== "number"
                    ? input.min
                    : undefined
                }
                maxDate={
                  input.max && typeof input.max !== "number"
                    ? input.max
                    : undefined
                }
                dateFormat="dd/mm/yy"
                disabled={!isEnabled}
              />
              <label htmlFor={input.id}>{input.label}</label>
            </FloatLabel>
            {shouldShowError && Array.isArray(errors) ? (
              <div>
                {errors.map((error, index) => (
                  <small key={index} className="p-error block">
                    {error}
                  </small>
                ))}
              </div>
            ) : (
              shouldShowError && (
                <small className="p-error block">{errors}</small>
              )
            )}
          </div>
        );
      case "select":
        return (
          <div key={input.id} className="w-full">
            <FloatLabel className={"block m-auto w-11"}>
              <Dropdown
                className="w-12"
                id={input.id}
                value={(formData[input.id] as string) || null}
                options={input.options}
                onChange={(e) => handleChange(input.id, e.target.value)}
                placeholder={
                  input.placeholder ||
                  `Seleccione un ${input.label?.toLowerCase()}`
                }
                disabled={!isEnabled}
              />
              <label htmlFor={input.id}>{input.label}</label>
            </FloatLabel>
            {shouldShowError && Array.isArray(errors) ? (
              <div>
                {errors.map((error, index) => (
                  <small key={index} className="p-error block">
                    {error}
                  </small>
                ))}
              </div>
            ) : (
              shouldShowError && (
                <small className="p-error block">{errors}</small>
              )
            )}
          </div>
        );
      case "file":
        return (
          <div key={input.id} className="w-full px-2">
            <label
              htmlFor={input.id}
              className="block text-900 font-medium mb-2 text-center"
            >
              {input.label}
            </label>
            <FileUpload
              className="text-center"
              name={input.id}
              ref={fileUploadRef}
              multiple
              accept="image/*"
              customUpload={true}
              onSelect={onFileSelect}
              onRemove={(e) => onFileRemove(e, input.id)}
              emptyTemplate={
                <div className="flex align-items-center flex-column">
                  <i className="pi pi-upload mb-3" />
                  <span className="mt-2 mb-4">{input.placeholder}</span>
                </div>
              }
              chooseLabel={input.uploadButtonLabel}
              disabled={!isEnabled}
            />
            {shouldShowError && Array.isArray(errors) ? (
              <div>
                {errors.map((error, index) => (
                  <small key={index} className="p-error block">
                    {error}
                  </small>
                ))}
              </div>
            ) : (
              shouldShowError && (
                <small className="p-error block">{errors}</small>
              )
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (input.optional) {
    return (
      <div
        className={`flex align-items-center gap-3 w-full ${
          shouldShowError ? "mb-3" : "mb-5"
        }`}
      >
        <Checkbox
          inputId={`checkbox-${input.id}`}
          checked={isEnabled}
          onChange={(e) =>
            handleOptionalFieldChange(input.id, e.checked || false)
          }
        />
        <div className="flex-grow-1">{renderInputControl()}</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${shouldShowError ? "mb-3" : "mb-5"}`}>
      {renderInputControl()}
    </div>
  );
};
