import { describe, test, before, beforeEach, after } from "node:test";
import { equal } from "node:assert/strict";
import { Logger } from "./index.ts";

const console_log = console.log;
const calls: any[] = [];

let logger: Logger;
const lastLog = (): any => JSON.parse(calls.at(-1).at(0));

describe("logger", () => {
  before(async () => {
    console.log = function (...args: any[]) {
      calls.push(args);
    };
    logger = new Logger();
  });
  beforeEach(() => {
    calls.length = 0;
  });
  after(() => {
    console.log = console_log;
  });
  test("pass all levels for default logger", () => {
    equal(calls.length, 0);
    logger.info("Hello", { key: "Value" });
    equal(calls.length, 1);
    equal(lastLog().level, "info");
    logger.debug("Hello", { key: "Value" });
    equal(calls.length, 2);
    equal(lastLog().level, "debug");
    logger.info("Hello", { key: "Value" });
    equal(calls.length, 3);
    equal(lastLog().level, "info");
    logger.warn("Hello", { key: "Value" });
    equal(calls.length, 4);
    equal(lastLog().level, "warn");
    logger.error("Hello", { key: "Value" });
    equal(calls.length, 5);
    equal(lastLog().level, "error");
  });
});
