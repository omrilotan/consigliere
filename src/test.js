/* eslint-env mocha */

import { jest } from "@jest/globals";
import { Logger } from "./lib/logger";

let logger;
let mdl;

const lastLog = () => JSON.parse(console.log.mock.calls.at(-1).at(0));

describe("logger", () => {
  beforeAll(async () => {
    jest.spyOn(console, "log");
    mdl = await import(`./index.js?${Date.now()}`);
    ({ logger } = mdl);
  });
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.clearAllMocks());
  it("exposes full interface", () => {
    expect(Object.keys(mdl)).toMatchSnapshot();
  });
  it("pass all levels for default logger", () => {
    expect(console.log).toHaveBeenCalledTimes(0);
    logger.info("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(lastLog().level).toBe("info");
    logger.debug("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(lastLog().level).toBe("debug");
    logger.info("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(lastLog().level).toBe("info");
    logger.warn("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(lastLog().level).toBe("warn");
    logger.error("Hello", { key: "Value" });
    expect(console.log).toHaveBeenCalledTimes(5);
    expect(lastLog().level).toBe("error");
  });
});
