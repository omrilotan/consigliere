/**
 * Parse input to JSON string or cast to string representation
 */
export function stringify(
  input: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string,
): string {
  try {
    return JSON.stringify(input, replacer, space);
  } catch (error) {
    return `${input}`;
  }
}
