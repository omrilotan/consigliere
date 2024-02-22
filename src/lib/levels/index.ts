export type DefaultLevels =
  | "trace"
  | "debug"
  | "verbose"
  | "info"
  | "warn"
  | "error"
  | "critical";

/** Ordered list of all levels. */
export const LEVELS: readonly DefaultLevels[] = Object.freeze([
  "trace",
  "debug",
  "verbose",
  "info",
  "warn",
  "error",
  "critical",
]);
