export type ErrorFields =
  | "message"
  | "stack"
  | "code"
  | "name"
  | "fileName"
  | "lineNumber"
  | "columnNumber"
  | "address"
  | "dest"
  | "errno"
  | "info"
  | "path"
  | "port"
  | "syscall"
  | "opensslErrorStack"
  | "function"
  | "library"
  | "reason"
  | "details"
  | "description";

/** A list of common error getters and properties */
export const ERROR_FIELDS: readonly ErrorFields[] = Object.freeze([
  // Error native getters
  "message",
  "stack",
  "code",

  // inherited (not own property)
  "name",

  // non standard browser fields
  "fileName",
  "lineNumber",
  "columnNumber",

  // SystemError
  "address",
  "dest",
  "errno",
  "info",
  "path",
  "port",
  "syscall",

  // OpenSSL error properties
  "opensslErrorStack",
  "function",
  "library",
  "reason",

  // custom
  "details",
  "description",
]);
