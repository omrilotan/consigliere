import { equal } from "node:assert/strict";
import { logger, RAW } from "consigliere";

logger.info("Hello, ESM");
equal(typeof RAW, "function");
