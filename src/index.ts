import { Logger } from "./lib/logger";
export * from "./lib/parsers";

/**
 * Ready to use logger
 */
const logger = new Logger();

export { Logger, logger };
