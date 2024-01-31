import { Logger } from "./lib/logger/index";
export * from "./lib/parsers/index";

/**
 * Ready to use logger
 */
const logger = new Logger();

export { Logger, logger };
