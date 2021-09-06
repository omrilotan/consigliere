import { log } from '../log/index.js'
import { LEVELS } from '../levels/index.js'

export class Logger {
  #levels = LEVELS
  #minimal = 0
  #device = console.log
  constructor ({
    levels = LEVELS,
    level = levels.at(0),
    device = console.log
  } = {}) {
    this.#setDevice(device)
    this.#setLevels(levels)
    this.#setLevel(level)

    return new Proxy(this, {
      get (logger, prop) {
        switch (prop) {
          case 'toString':
            return () => `Logger(${levels[logger.#minimal]})`
          case 'level':
            return logger.#levels[logger.#minimal]
          case 'levels':
            return logger.#levels
          case 'device':
            return logger.#device
          default:
            if (!levels.includes(prop)) {
              throw new RangeError(`Logger level must be one of [${levels.join(',')}]. Instead got [${prop}].`)
            }
            return levels.indexOf(prop) < logger.#minimal
              ? () => undefined
              : log.bind({ level: prop, device })
        }
      },
      set (logger, prop, value) {
        if (Object.isFrozen(logger)) {
          return logger
        }

        switch (prop) {
          case 'level':
            logger.#setLevel(value)
            break
          case 'levels':
            logger.#setLevels(value)
            break
          case 'device':
            logger.#setDevice(value)
            break
          default:
            throw new Error('Setting properties is only allowed for [level,levels,device]')
        }
        return logger
      }
    })
  }

  #setLevel (level) {
    const index = this.#levels.indexOf(level)
    if (index === -1) {
      throw new RangeError(`level must be one of [${this.#levels.join(',')}]. Instead got [${level}].`)
    }
    this.#minimal = index
  }

  #setLevels (levels) {
    if (!Array.isArray(levels)) {
      throw new TypeError(`levels must be an array, instead got ${typeof levels} (${levels})`)
    }

    if (levels.some(level => typeof level !== 'string')) {
      throw new TypeError(`levels must be an array of strings, instead got ${levels.map(level => typeof level)} (${levels.join(', ')})`)
    }

    this.#levels = levels
  }

  #setDevice (device) {
    if (typeof device !== 'function') {
      throw new TypeError(`device must be a function, instead got ${typeof device} (${device})`)
    }
    this.#device = device
  }
}
