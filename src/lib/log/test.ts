import { describe, test, before, beforeEach, after } from "node:test";
import { deepEqual } from "node:assert/strict";
import { log } from "./index.ts";
import type { LogContext } from "./index.ts";
import { NORMALISE, NORMALISE_VALUES, RAW } from "../parsers/index.ts";
import { Logger } from "../../index.ts";

interface ExtendedError extends Error {
  [key: string]: any;
}
let logger: Logger;

const console_log = console.log;
const calls: any[] = [];
const lastLog = (): any => calls.at(-1).at(0);
let context: (obj?: Object) => LogContext;

describe("logger", () => {
  before(async () => {
    console.log = function (...args: any[]) {
      calls.push(args);
    };
    context = (obj?: Object): LogContext =>
      Object.assign(
        {
          level: "info" as LogContext["level"],
          device: console.log,
          parser: NORMALISE,
          fields: {},
          dynamicFields: () => ({}),
        },
        obj || {},
      );
  });
  beforeEach(() => {
    calls.length = 0;
  });
  after(() => {
    console.log = console_log;
  });

  test("Logs string message and enrichment", () => {
    log.call(context(), "Hello", { key: "Value" });
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      message: "Hello",
      key: "Value",
    });
  });
  test("Logs objects", () => {
    log.call(context(), { key: "Value" });
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      key: "Value",
    });
  });
  test("Parses error and enrichment", () => {
    const error = new TypeError("Something must have gone horribly wrong", {
      cause: new Error("Something went wrong before this"),
    });
    Object.defineProperties(error, {
      info: { get: () => "Information", enumerable: false },
      hidden: { get: () => "Hidden", enumerable: false },
      visible: { get: () => "Visible", enumerable: true },
    });
    (error as ExtendedError).unregistered = "Unregistered";
    log.call(context(), error, { key: "Value" });
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      message: "Something must have gone horribly wrong",
      name: "TypeError",
      stack: error.stack,
      key: "Value",
      cause: "Something went wrong before this",
      info: "Information",
      visible: "Visible",
      unregistered: "Unregistered",
    });
  });
  test("Coerces arrays", () => {
    log.call(context(), [1, 2, 3]);
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      message: "1, 2, 3",
    });
  });
  test("Coerces other things into strings", () => {
    log.call(
      context(),
      new Map([
        ["a", 1],
        ["b", 2],
      ]),
      { key: "Value" },
    );
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      message: "{}",
      key: "Value",
    });
  });
  test("Normalises nested fields", () => {
    log.call(context(), { key: { key: "Value" } });
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      key: {
        key: "Value",
      },
    });
  });
  test("Normalises array items", () => {
    log.call(context(), [{ key: "Value" }, { key: "Value" }]);
    deepEqual(JSON.parse(lastLog()), {
      level: "info",
      message: "[object Object], [object Object]",
    });
  });
  test("serves the raw record", () => {
    const record = { key: "Value" };
    log.call(context({ parser: RAW }), record);
    deepEqual(lastLog(), {
      level: "info",
      ...record,
    });
  });
  test("serves the normalised record", () => {
    log.call(context({ parser: NORMALISE_VALUES }), "hello", { key: "Value" });
    deepEqual(lastLog(), {
      level: "info",
      message: "hello",
      key: "Value",
    });
  });
});
