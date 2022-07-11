/** Check wheather a value is primitive */
export const isPrimitive = (value: any): boolean =>
  value === null || !["function", "object"].includes(typeof value);
