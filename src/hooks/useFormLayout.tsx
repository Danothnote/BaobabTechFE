import React, { useMemo } from "react";
import type { FormInput, UseFormLayoutProps } from "../types/formTypes";
import { createInputs } from "../helpers/createInputs";

export const useFormLayout = ({
  inputs,
  formData,
  errors,
  handleChange,
  touchedFields,
  threshold = 5,
  fileUploadRef: fileUploadRef,
}: UseFormLayoutProps): React.ReactNode => {
  const renderInputs = useMemo(() => {
    const renderSingleInput = (input: FormInput) =>
      createInputs({
        input: input,
        formData: formData,
        errors: errors[input.id],
        handleChange: handleChange,
        isTouched: touchedFields[input.id],
        fileUploadRef: fileUploadRef,
      });

    const fileInput = inputs.find((input) => input.type === "file");
    const otherInputs = inputs.filter((input) => input.type !== "file");

    const totalOtherInputs = otherInputs.length;
    const shouldApplyComplexLayout = totalOtherInputs > threshold;

    return (
      <div className="flex flex-column mt-5 align-items-center px-5">
        {shouldApplyComplexLayout ? (
          <>
            {totalOtherInputs % 2 !== 0 && otherInputs[0] && (
              <div className="col-12 md:col-6">
                {renderSingleInput(otherInputs[0])}
              </div>
            )}
            <div className="grid w-full justify-content-around">
              <div className="col-12 md:col-6 flex flex-column gap-2">
                {otherInputs
                  .slice(
                    totalOtherInputs % 2 !== 0 ? 1 : 0,
                    Math.ceil(totalOtherInputs / 2)
                  )
                  .map((input: FormInput) => (
                    <React.Fragment key={input.id}>
                      {renderSingleInput(input)}
                    </React.Fragment>
                  ))}
              </div>
              <div className="col-12 md:col-6 flex flex-column gap-2">
                {otherInputs
                  .slice(Math.ceil(totalOtherInputs / 2))
                  .map((input: FormInput) => (
                    <React.Fragment key={input.id}>
                      {renderSingleInput(input)}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap px-2 gap-2 w-full justify-content-center">
            {otherInputs.map((input: FormInput) => (
              <React.Fragment key={input.id}>
                {renderSingleInput(input)}
              </React.Fragment>
            ))}
          </div>
        )}

        {fileInput && (
          <div className="col-12">{renderSingleInput(fileInput)}</div>
        )}
      </div>
    );
  }, [inputs, formData, errors, handleChange, touchedFields, threshold]);

  return renderInputs;
};
