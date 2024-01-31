let cjsInterface;
let esmInterface;

describe("build", () => {
  beforeAll(async () => {
    const mdl = await import("./package.json");
    const files = mdl.default.exports["."];
    esmInterface = await import(files.import);
    cjsInterface = require(files.require);
  });
  test("ESM interface", () => {
    expect(Object.keys(esmInterface)).toMatchSnapshot();
  });
  test("CJS interface", () => {
    expect(Object.keys(cjsInterface)).toMatchSnapshot();
  });
});
