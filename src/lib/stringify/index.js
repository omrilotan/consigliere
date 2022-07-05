export function stringify(input, replacer, space) {
  try {
    return JSON.stringify(input, replacer, space);
  } catch (error) {
    return `${input}`;
  }
}
