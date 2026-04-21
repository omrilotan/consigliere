import { Logger } from "./lib/logger/index.ts";
export * from "./lib/parsers/index.ts";
export type { DefaultLevels } from "./lib/levels/index.ts";
export type { ErrorFields } from "./lib/errorFields/index.ts";

/**
 * Ready to use logger
 */
const logger = new Logger();

export { Logger, logger };
