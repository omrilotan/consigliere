/* eslint-env mocha */

import { jest } from "@jest/globals";
import { log } from "./index";
import { NORMALISE_VALUES, RAW } from "../parsers";

interface ExtendedError extends Error {
  [key: string]: any;
}
let logger;

const lastLog = (): any =>
  JSON.parse((console.log as jest.Mock).mock.calls.at(-1).at(0));
const context = (obj?: Object): Object =>
  Object.assign(
    {
      level: "info",
      device: console.log,
    },
    obj || {}
  );

describe("logger", () => {
  beforeAll(async () => {
    jest.spyOn(console, "log");
  });
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.clearAllMocks());

  it("Logs string message and enrichment", () => {
    log.call(context(), "Hello", { key: "Value" });
    expect(lastLog()).toEqual({
      level: "info",
      message: "Hello",
      key: "Value",
    });
  });
  it("Logs objects", () => {
    log.call(context(), { key: "Value" });
    expect(lastLog()).toEqual({
      level: "info",
      key: "Value",
    });
  });
  it("Parses error and enrichment", () => {
    const error = new TypeError("Something must have gone horribly wrong");
    Object.defineProperties(error, {
      info: { get: () => "Information", enumerable: false },
      hidden: { get: () => "Hidden", enumerable: false },
      visible: { get: () => "Visible", enumerable: true },
    });
    (error as ExtendedError).unregistered = "Unregistered";
    log.call(context(), error, { key: "Value" });
    expect(lastLog()).toEqual({
      level: "info",
      message: "Something must have gone horribly wrong",
      name: "TypeError",
      stack: error.stack,
      key: "Value",
      info: "Information",
      visible: "Visible",
      unregistered: "Unregistered",
    });
  });
  it("Coerces arrays", () => {
    log.call(context(), [1, 2, 3]);
    expect(lastLog()).toEqual({
      level: "info",
      message: "1, 2, 3",
    });
  });
  it("Coerces other things into strings", () => {
    log.call(
      context(),
      new Map([
        ["a", 1],
        ["b", 2],
      ]),
      { key: "Value" }
    );
    expect(lastLog()).toEqual({
      level: "info",
      message: "{}",
      key: "Value",
    });
  });
  it("Normalises nested fields", () => {
    log.call(context(), { key: { key: "Value" } });
    expect(lastLog()).toEqual({
      level: "info",
      key: {
        key: "Value",
      },
    });
  });
  it("Normalises array items", () => {
    log.call(context(), [{ key: "Value" }, { key: "Value" }]);
    expect(lastLog()).toEqual({
      level: "info",
      message: "[object Object], [object Object]",
    });
  });
  it("serves the raw record", () => {
    const record = { key: "Value" };
    log.call(context({ parser: RAW }), record);
    expect((console.log as jest.Mock).mock.calls.at(-1).at(0)).toEqual({
      level: "info",
      ...record,
    });
  });
  it("serves the normalised record", () => {
    log.call(context({ parser: NORMALISE_VALUES }), "hello", { key: "Value" });
    expect((console.log as jest.Mock).mock.calls.at(-1).at(0)).toEqual({
      level: "info",
      message: "hello",
      key: "Value",
    });
  });
});
