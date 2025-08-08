import type { ClientFormData, FormInput } from "../types/formTypes";

export const createInitialFormState = (inputs: FormInput[]): ClientFormData => {
  const state: ClientFormData = {};

  for (const input of inputs) {
    state[input.id] = undefined;
  }

  return state;
};