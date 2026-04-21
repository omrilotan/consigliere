import { describe, test, before, beforeEach, after } from "node:test";
import { deepEqual, equal } from "node:assert/strict";
import { Logger } from "./index.ts";

const console_log = console.log;
const calls: any[] = [];
const lastLog = (): any => JSON.parse(calls.at(-1).at(0));

describe("lib/logger", () => {
  before(async () => {
    console.log = function (...args: any[]) {
      calls.push(args);
    };
  });
  beforeEach(() => {
    calls.length = 0;
  });
  after(() => {
    console.log = console_log;
  });

  test("passes the JSON string to console.log", () => {
    const logger = new Logger();
    logger.info("Hello", { key: "Value" });
    const record = lastLog();
    deepEqual(record, {
      level: "info",
      message: "Hello",
      key: "Value",
    });
  });
  test("pass level equal to or higher than logger level", () => {
    const logger = new Logger({ level: "warn" });
    logger.debug("Hello", { key: "Value" });
    equal(calls.length, 0);
    logger.info("Hello", { key: "Value" });
    equal(calls.length, 0);
    logger.warn("Hello", { key: "Value" });
    equal(calls.length, 1);
    logger.error("Hello", { key: "Value" });
    equal(calls.length, 2);
  });
  test("uses alternative logging device (accepts promise)", async () => {
    let internalCalls = 0;
    const alternative = async () => {
      internalCalls++;
      return 5;
    };
    const logger = new Logger({ level: "warn", device: alternative });
    const result1 = logger.debug("Hello", { key: "Value" });
    equal(internalCalls, 0);
    equal(result1.constructor.name, "Promise");
    equal(await result1, undefined);
    const result2 = logger.warn("Hello", { key: "Value" });
    equal(internalCalls, 1);
    equal(result2.constructor.name, "Promise");
    equal(await result2, 5);
  });
  test("can change logger settings at runtime", () => {
    const logger = new Logger({ level: "warn" });
    equal(logger.level, "warn");
    logger.info("Hello");
    equal(calls.length, 0);
    logger.levels = ["debug", "info", "warn", "error"];
    logger.level = "debug";
    deepEqual(logger.levels, ["debug", "info", "warn", "error"]);
    equal(logger.level, "debug");
    logger.info("Hello");
    equal(calls.length, 1);
  });
  test("can set constant fields to a logger", () => {
    const logger = new Logger({ level: "warn", fields: { version: "1.0.0" } });
    logger.warn({ key: "Value" });
    const record = lastLog();
    deepEqual(record, {
      key: "Value",
      version: "1.0.0",
      level: "warn",
    });
  });
  test("can set dynamic fields to a logger", () => {
    const logger = new Logger({
      level: "warn",
      fields: { version: "1.0.0" },
      dynamicFields: () => ({ app: "my-app" }),
    });
    logger.warn({ key: "Value" });
    const record = lastLog();
    deepEqual(record, {
      key: "Value",
      version: "1.0.0",
      level: "warn",
      app: "my-app",
    });
  });
  test("log object takes presedence to constant fields", () => {
    const logger = new Logger({
      level: "warn",
      fields: { version: "1.0.0", app: "my-app" },
    });
    logger.warn({ key: "Value", version: "2.0.0" });
    const record = lastLog();
    deepEqual(record, {
      key: "Value",
      version: "2.0.0",
      app: "my-app",
      level: "warn",
    });
  });
  test("Logger has proper getters", () => {
    const logger = new Logger({ level: "warn" });
    equal(logger.toString(), "Logger(warn)");
    equal(logger.level, "warn");
    deepEqual(logger.levels, [
      "trace",
      "debug",
      "verbose",
      "info",
      "warn",
      "error",
      "critical",
    ]);
    equal(logger.device, console.log);
  });
  test("Logger can be frozen", () => {
    const logger = new Logger({ level: "warn" });
    Object.freeze(logger);
    logger.level = "debug";
    logger.levels = "debug";
    equal(logger.level, "warn");
    deepEqual(logger.levels, [
      "trace",
      "debug",
      "verbose",
      "info",
      "warn",
      "error",
      "critical",
    ]);
  });
});
