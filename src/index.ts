import { Logger } from "./lib/logger";
export * from "./lib/parsers";
export type { DefaultLevels } from "./lib/levels";
export type { ErrorFields } from "./lib/errorFields";

/**
 * Ready to use logger
 */
const logger = new Logger();

export { Logger, logger };
