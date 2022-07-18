import { ERROR_FIELDS } from "../errorFields/index";
import { stringify } from "../stringify/index";
import { isPrimitive } from "../isPrimitive/index";
import { NORMALISE, RAW } from "../parsers/index";

export function log(subject: any, enrichment = {}): any {
  const record = {};
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
      ...ERROR_FIELDS.map((field) => ({ [field]: subject[field] }))
    );
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
    ...enrichment,
    ...record,
    level: this.level,
  });

  return this.device.call(context, output);
}

function getParser({ parser }): Function {
  if (parser === false) {
    return RAW;
  }
  if (typeof parser === "function") {
    return parser;
  }

  return NORMALISE;
}
