export const isPrimitive = (value) =>
  value === null || !["function", "object"].includes(typeof value);
