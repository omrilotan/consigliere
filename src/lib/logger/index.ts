import { log } from "../log";
import { NORMALISE } from "../parsers";
import { LEVELS } from "../levels";

/**
 * Logger class. Can be used to create multiple loggers with different settings.
 */
export class Logger {
  #levels: string[] | readonly string[] = LEVELS;
  #minimal: number = 0;
  #device: Function = console.log;
  #parser: false | Function = NORMALISE;
  #fields: Record<string, any>;
  #dynamicFields: () => Record<string, any>;
  [key: string]: any;
  constructor({
    levels = LEVELS,
    level = levels.at(0),
    device = console.log,
    parser = NORMALISE,
    fields = {},
    dynamicFields = () => ({}),
  }: {
    levels?: string[] | readonly string[];
    level?: string;
    device?: (message?: any, ...optionalParams: any[]) => void;
    parser?: (input: any) => string;
    fields?: Record<string, any>;
    dynamicFields?: () => Record<string, any>;
  } = {}) {
    this.#setDevice(device);
    this.#setLevels(levels);
    this.#setLevel(level);
    this.#setParser(parser);
    this.#setFields(fields);
    this.#setDynamicFields(dynamicFields);

    return new Proxy(this, {
      get(logger: Logger, prop: string | symbol) {
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
            return levels.indexOf(prop) < logger.#minimal
              ? () => Promise.resolve(undefined)
              : log.bind({
                  level: prop,
                  device,
                  parser: logger.#parser,
                  fields: logger.#fields,
                  dynamicFields: logger.#dynamicFields,
                });
        }
      },
      set(logger: Logger, prop: string | symbol, value): boolean {
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
    });
  }

  #setLevel(level: string): void {
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

  #setLevels(levels: string[] | readonly string[]): void {
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

  #setParser(parser: false | Function): void {
    if (parser !== false && typeof parser !== "function") {
      throw new TypeError(
        `parser must be a function or the boolean "false", instead got ${typeof parser} (${parser})`,
      );
    }
    this.#parser = parser;
  }

  #setDevice(device: Function): void {
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
}
