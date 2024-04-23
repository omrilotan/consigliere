import { ERROR_FIELDS } from "../errorFields";
import { stringify } from "../stringify";
import { isPrimitive } from "../isPrimitive";
import { NORMALISE, RAW } from "../parsers";

/**
 * Log to the configured device, using parser, with enrichment. Filter according to level.
 */
export function log(subject: any, enrichment = {}): any {
  const record: Record<string, any> = {};
  const context = {
    level: this.level,
  };

  if (isPrimitive(subject)) {
    Object.assign(record, { message: subject });
  } else if (typeof subject?.toJSON === "function") {
    Object.assign(record, subject.toJSON());
  } else if (subject instanceof Error) {
    Object.assign(
      record,
      { ...subject },
      ...ERROR_FIELDS.map((field) => ({ [field]: subject[field] })),
    );
    record.cause = getCause(subject);
  } else if (Array.isArray(subject)) {
    Object.assign(record, { message: subject.join(", ") });
  } else if (subject?.toString() === "[object Object]") {
    Object.assign(record, subject);
  } else {
    Object.assign(record, { message: stringify(subject) });
  }

  const parser = getParser(this);

  const output = parser.call(context, {
    ...this.fields,
    ...this.dynamicFields?.(),
    ...enrichment,
    ...record,
    level: this.level,
  });

  return this.device.call(context, output);
}

/**
 * Use the appropriate parser for the logger
 */
function getParser({ parser }: { parser: Function | boolean }): Function {
  if (parser === false) {
    return RAW;
  }
  if (typeof parser === "function") {
    return parser;
  }

  return NORMALISE;
}

/**
 * Get a string representation of cause property of an error
 */
function getCause(error: Error): string | undefined {
  if (!("cause" in error)) {
    return undefined;
  }
  const { cause } = error;
  if (cause instanceof Error) {
    if (cause === error) {
      return "[Circular]";
    } else {
      return cause.message;
    }
  }
  return typeof cause === "undefined" ? cause : String(cause);
}
