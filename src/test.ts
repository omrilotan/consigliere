import { jest } from "@jest/globals";
import { Logger } from ".";

let logger;
const lastLog = (): any =>
  JSON.parse(
    ((console.log as jest.Mock).mock.calls as string[][]).at(-1).at(0),
  );

describe("logger", () => {
  beforeAll(async () => {
    jest.spyOn(console, "log");
    logger = new Logger();
  });
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.clearAllMocks());
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
