const {
  strict: { equal },
} = require("assert");
const { logger, RAW } = require("consigliere");

logger.info("Hello, CJS");
equal(typeof RAW, "function");
