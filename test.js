let cjsInterface;
let esmInterface;

describe("build", () => {
  beforeAll(async () => {
    esmInterface = await import("./index.mjs");
    cjsInterface = require("./index.js");
  });
  test("ESM interface", () => {
    expect(Object.keys(esmInterface)).toMatchSnapshot();
  });
  test("CJS interface", () => {
    expect(Object.keys(cjsInterface)).toMatchSnapshot();
  });
});
