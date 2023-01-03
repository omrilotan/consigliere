/* eslint-env jest */

import { jest } from "@jest/globals";
import { Logger } from "./index";

describe("lib/logger", () => {
  beforeAll(async () => jest.spyOn(console, "log"));
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.clearAllMocks());
  it("passes the JSON string to console.log", () => {
    const logger = new Logger();
    logger.info("Hello", { key: "Value" });
    const [[message]] = (console.log as jest.Mock).mock.calls as string[][];
    expect(JSON.parse(message)).toEqual({
      level: "info",
      message: "Hello",
      key: "Value",
    });
  });
  it("pass level equal to or higher than logger level", () => {
    const logger = new Logger({ level: "warn" });
    logger.debug("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(0);
    logger.info("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(0);
    logger.warn("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(1);
    logger.error("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(2);
  });
  it("uses alternative logging device (accepts promise)", async () => {
    const alternative = jest.fn(async () => 5);
    const logger = new Logger({ level: "warn", device: alternative });
    const result1 = logger.debug("Hello", { key: "Value" });
    expect(alternative).toHaveBeenCalledTimes(0);
    expect(result1.constructor.name).toBe("Promise");
    expect(await result1).toBe(undefined);
    const result2 = logger.warn("Hello", { key: "Value" });
    expect(alternative).toHaveBeenCalledTimes(1);
    expect(result2.constructor.name).toBe("Promise");
    expect(await result2).toBe(5);
  });
  it("can change logger settings at runtime", () => {
    const logger = new Logger({ level: "warn" });
    expect(logger.level).toBe("warn");
    logger.info("Hello");
    expect(console.log).toHaveBeenCalledTimes(0);
    logger.levels = ["debug", "info", "warn", "error"];
    logger.level = "debug";
    expect(logger.levels).toEqual(["debug", "info", "warn", "error"]);
    expect(logger.level).toBe("debug");
    logger.info("Hello");
    expect(console.log).toHaveBeenCalledTimes(1);
  });
  it("can set constant fields to a logger", () => {
    const logger = new Logger({ level: "warn", fields: { version: "1.0.0" } });
    logger.warn({ key: "Value" });
    const [[record]] = (console.log as jest.Mock).mock.calls as string[][];
    expect(JSON.parse(record)).toEqual({
      key: "Value",
      version: "1.0.0",
      level: "warn",
    });
  });
  it("log object takes presedence to constant fields", () => {
    const logger = new Logger({
      level: "warn",
      fields: { version: "1.0.0", app: "my-app" },
    });
    logger.warn({ key: "Value", version: "2.0.0" });
    const [[record]] = (console.log as jest.Mock).mock.calls as string[][];
    expect(JSON.parse(record)).toEqual({
      key: "Value",
      version: "2.0.0",
      app: "my-app",
      level: "warn",
    });
  });
  it("Logger has proper getters", () => {
    const logger = new Logger({ level: "warn" });
    expect(logger.toString()).toBe("Logger(warn)");
    expect(logger.level).toBe("warn");
    expect(logger.levels).toEqual([
      "trace",
      "debug",
      "verbose",
      "info",
      "warn",
      "error",
      "critical",
    ]);
    expect(logger.device).toBe(console.log);
  });
  it("Logger can be frozen", () => {
    const logger = new Logger({ level: "warn" });
    Object.freeze(logger);
    logger.level = "debug";
    logger.levels = "debug";
    expect(logger.level).toBe("warn");
    expect(logger.levels).toEqual([
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
