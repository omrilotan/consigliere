import { isPrimitive } from "../isPrimitive/index";
import { stringify } from "../stringify/index";

/**
 * Return input as is
 */
export const RAW = (input: any): any => input;

/**
 * Normalise input to string
 */
export function NORMALISE(input: any): string {
  if (isPrimitive(input)) {
    return input;
  }
  if (input instanceof Date) {
    return input.toUTCString();
  }

  return stringify(input);
}

/**
 * Normalise input to object with string values
 */
export const NORMALISE_VALUES = (input: Object): Object =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, NORMALISE(value)]),
  );
