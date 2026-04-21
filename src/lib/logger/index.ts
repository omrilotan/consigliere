import { log } from "../log/index.ts";
import type { LogContext } from "../log/index.ts";
import { NORMALISE } from "../parsers/index.ts";
import { LEVELS } from "../levels/index.ts";
import type { DefaultLevels } from "../levels/index.ts";

type LoggerLevelMethod = (
  subject: any,
  enrichment?: Record<string, any>,
) => any;

type LoggerPublicShape<Levels extends string[]> = {
  [K in Levels[number]]: LoggerLevelMethod;
} & {
  toString: () => string;
  level: Levels[number];
  levels: Levels;
  device: (this: LogContext, message?: any, ...optionalParams: any[]) => void;
};

type LoggerOptions<Levels extends string[]> = {
  levels?: Levels;
  level?: Levels[number];
  device?: (this: LogContext, message?: any, ...optionalParams: any[]) => void;
  parser?: false | ((input: any) => string);
  fields?: Record<string, any>;
  dynamicFields?: () => Record<string, any>;
};

type LoggerConstructor = {
  new <Levels extends string[] = DefaultLevels[]>(
    options?: LoggerOptions<Levels>,
  ): LoggerPublicShape<Levels>;
};

export type Logger<Levels extends string[] = DefaultLevels[]> =
  LoggerPublicShape<Levels>;

/**
 * Logger implementation. Can be used to create multiple loggers with different settings.
 */
const LoggerClass = class Logger<Levels extends string[] = DefaultLevels[]> {
  #levels!: Levels;
  #minimal: number = 0;
  #device: (this: LogContext, message?: any, ...optionalParams: any[]) => void =
    console.log;
  #parser: false | ((input: any) => string) = NORMALISE;
  #fields!: Record<string, any>;
  #dynamicFields!: () => Record<string, any>;
  constructor({
    levels = LEVELS as Levels,
    level = levels.at(0),
    device = console.log,
    parser = NORMALISE,
    fields = {},
    dynamicFields = () => ({}),
  }: LoggerOptions<Levels> = {}) {
    this.#setDevice(device);
    this.#setLevels(levels);
    this.#setLevel(level!);
    this.#setParser(parser);
    this.#setFields(fields);
    this.#setDynamicFields(dynamicFields);

    return new Proxy(this, {
      get(logger: Logger<Levels>, prop: string | symbol) {
        if (typeof prop !== "string") {
          return;
        }
        switch (prop) {
          case "toString":
            return () => `Logger(${levels[logger.#minimal]})`;
          case "level":
            return logger.#levels[logger.#minimal];
          case "levels":
            return logger.#levels;
          case "device":
            return logger.#device;
          default:
            if (!levels.includes(prop)) {
              throw new RangeError(
                `Logger level must be one of [${levels.join(
                  ",",
                )}]. Instead got [${prop}].`,
              );
            }

            // If the level is below the minimal level, return a no-op function
            if (levels.indexOf(prop) < logger.#minimal)
              return () => Promise.resolve(undefined);
            return log.bind({
              level: prop,
              device,
              parser: logger.#parser,
              fields: logger.#fields,
              dynamicFields: logger.#dynamicFields,
            } as LogContext);
        }
      },
      set(logger: any, prop: string | symbol, value): boolean {
        if (Object.isFrozen(logger)) {
          return true;
        }

        switch (prop) {
          case "level":
            logger.#setLevel(value);
            break;
          case "levels":
            logger.#setLevels(value);
            break;
          case "device":
            logger.#setDevice(value);
            break;
          default:
            throw new Error(
              "Setting properties is only allowed for [level,levels,device]",
            );
        }
        return true;
      },
    }) as this;
  }

  #setLevel(level: Levels[number]): void {
    const index = this.#levels.indexOf(level);
    if (index === -1) {
      throw new RangeError(
        `level must be one of [${this.#levels.join(
          ",",
        )}]. Instead got [${level}].`,
      );
    }
    this.#minimal = index;
  }

  #setLevels(levels: Levels | readonly string[]): void {
    if (!Array.isArray(levels)) {
      throw new TypeError(
        `levels must be an array, instead got ${typeof levels} (${levels})`,
      );
    }

    if (levels.some((level) => typeof level !== "string")) {
      throw new TypeError(
        `levels must be an array of strings, instead got ${levels.map(
          (level) => typeof level,
        )} (${levels.join(", ")})`,
      );
    }

    this.#levels = levels;
  }

  #setParser(parser: false | ((input: any) => string)): void {
    if (parser !== false && typeof parser !== "function") {
      throw new TypeError(
        `parser must be a function or the boolean "false", instead got ${typeof parser} (${parser})`,
      );
    }
    this.#parser = parser;
  }

  #setDevice(
    device: (this: LogContext, message?: any, ...optionalParams: any[]) => void,
  ): void {
    if (typeof device !== "function") {
      throw new TypeError(
        `device must be a function, instead got ${typeof device} (${device})`,
      );
    }
    this.#device = device;
  }

  #setFields(fields: object): void {
    if (fields.toString() !== "[object Object]") {
      throw new TypeError(
        `fields must be an object, instead got ${typeof fields} (${fields})`,
      );
    }
    this.#fields = fields;
  }

  #setDynamicFields(dynamicFields: () => Record<string, any>): void {
    if (typeof dynamicFields !== "function") {
      throw new TypeError(
        `dynamicFields must be a function, instead got ${typeof dynamicFields} (${dynamicFields})`,
      );
    }
    this.#dynamicFields = dynamicFields;
  }
};

export const Logger = LoggerClass as unknown as LoggerConstructor;
