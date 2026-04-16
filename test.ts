import { deepEqual, equal } from "node:assert/strict";
import { createRequire } from "node:module";
import { before, describe, test } from "node:test";

const require = createRequire(import.meta.url);
let cjsInterface: any;
let esmInterface: any;

describe("build", () => {
  before(async () => {
    const mdl = await import("./package.json", { with: { type: "json" } });
    const files = mdl.default.exports["."];
    esmInterface = await import(files.import);
    cjsInterface = require(files.require);
  });

  test("ESM and CJS expose the same API", () => {
    deepEqual(
      Object.keys(esmInterface).sort(),
      Object.keys(cjsInterface).sort(),
    );
  });

  test("CJS module exports expected members", () => {
    equal(typeof cjsInterface.Logger, "function");
    equal(typeof cjsInterface.logger, "object");
  });
});
