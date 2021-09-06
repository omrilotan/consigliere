/* eslint-env mocha */

import { called, deepEqual, equal, mockConsole, restoreConsole } from '../../../specHelpers/index.js'
import { Logger } from './index.js'

function alternative (json) {
  called(alternative, [json])
  return 5
}

describe('lib/logger', () => {
  before(async () => {
    mockConsole()
  })
  beforeEach(() => {
    called()
  })
  after(() => {
    called()
    restoreConsole()
  })
  it('passes the JSON string to console.log', () => {
    const logger = new Logger()
    logger.info('Hello', { key: 'Value' })
    const [[message]] = called(console.log)
    deepEqual(
      JSON.parse(message),
      {
        level: 'info',
        message: 'Hello',
        key: 'Value'
      }
    )
  })
  it('pass level equal to or higher than logger level', () => {
    const logger = new Logger({ level: 'warn' })
    logger.debug('Hello', { key: 'Value' })
    equal(called(console.log).length, 0)
    logger.info('Hello', { key: 'Value' })
    equal(called(console.log).length, 0)
    logger.warn('Hello', { key: 'Value' })
    equal(called(console.log).length, 1)
    logger.error('Hello', { key: 'Value' })
    equal(called(console.log).length, 2)
  })
  it('uses alternative logging device', () => {
    const logger = new Logger({ level: 'warn', device: alternative })
    const result1 = logger.debug('Hello', { key: 'Value' })
    equal(called(alternative).length, 0)
    equal(result1, undefined)
    const result2 = logger.warn('Hello', { key: 'Value' })
    equal(called(alternative).length, 1)
    equal(result2, 5)
  })
  it('can change logger settings at runtime', () => {
    const logger = new Logger({ level: 'warn' })
    equal(logger.level, 'warn')
    logger.info('Hello')
    equal(called(console.log).length, 0)
    logger.levels = ['debug', 'info', 'warn', 'error']
    logger.level = 'debug'
    deepEqual(logger.levels, ['debug', 'info', 'warn', 'error'])
    equal(logger.level, 'debug')
    logger.info('Hello')
    equal(called(console.log).length, 1)
  })
  it('Logger has proper getters', () => {
    const logger = new Logger({ level: 'warn' })
    equal(logger.toString(), 'Logger(warn)')
    equal(logger.level, 'warn')
    deepEqual(logger.levels, ['trace', 'debug', 'verbose', 'info', 'warn', 'error', 'critical'])
    equal(logger.device, console.log)
  })
  it('Logger can be frozen', () => {
    const logger = new Logger({ level: 'warn' })
    Object.freeze(logger)
    logger.level = 'debug'
    logger.levels = 'debug'
    equal(logger.level, 'warn')
    deepEqual(logger.levels, ['trace', 'debug', 'verbose', 'info', 'warn', 'error', 'critical'])
  })
})
