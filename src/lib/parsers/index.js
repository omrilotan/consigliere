import { isPrimitive } from "../isPrimitive/index.js";
import { stringify } from "../stringify/index.js";

const raw = (input) => input;

function normalise(input) {
  if (isPrimitive(input)) {
    return input;
  }
  if (input instanceof Date) {
    return input.toUTCString();
  }

  return stringify(input);
}

const normalised = (input) =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, normalise(value)])
  );

export const NORMALISE = normalise;
export const RAW = raw;
export const NORMALISE_VALUES = normalised;
