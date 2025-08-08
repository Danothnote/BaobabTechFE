import { errorStrings } from "../strings/errorPasswordStrings";

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push(errorStrings.minCharacters);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(errorStrings.hasUppercase);
  }
  if (!/[a-z]/.test(password)) {
    errors.push(errorStrings.hasLowercase);
  }
  if (!/[0-9]/.test(password)) {
    errors.push(errorStrings.hasNumber);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(errorStrings.hasSpecialCharacter);
  }
  if (/[\s]/.test(password)) {
    errors.push(errorStrings.hasSpaces);
  }
  return errors;
};
