import { isPrimitive } from "../isPrimitive/index";
import { stringify } from "../stringify/index";

const raw = (input: any): any => input;

function normalise(input: any): string {
  if (isPrimitive(input)) {
    return input;
  }
  if (input instanceof Date) {
    return input.toUTCString();
  }

  return stringify(input);
}

const normalised = (input: Object): Object =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, normalise(value)]),
  );

export const NORMALISE = normalise;
export const RAW = raw;
export const NORMALISE_VALUES = normalised;
