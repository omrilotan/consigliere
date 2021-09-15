/* eslint-env mocha */

import { called, equal, mockConsole, restoreConsole } from '../specHelpers/index.js'

let logger

const lastLog = () => JSON.parse(
  called(console.log).at(-1).at(0)
)

describe('logger', () => {
  before(async () => {
    mockConsole()
    const mdl = await import(`./index.js?${Date.now()}`)
    ;({ logger } = mdl)
  })
  beforeEach(() => {
    called()
  })
  after(() => {
    called()
    restoreConsole()
  })
  it('pass all levels for default logger', () => {
    equal(called(console.log).length, 0)
    logger.info('Hello', { key: 'Value' })
    equal(called(console.log).length, 1)
    equal(lastLog().level, 'info')
    logger.debug('Hello', { key: 'Value' })
    equal(called(console.log).length, 2)
    equal(lastLog().level, 'debug')
    logger.info('Hello', { key: 'Value' })
    equal(called(console.log).length, 3)
    equal(lastLog().level, 'info')
    logger.warn('Hello', { key: 'Value' })
    equal(called(console.log).length, 4)
    equal(lastLog().level, 'warn')
    logger.error('Hello', { key: 'Value' })
    equal(called(console.log).length, 5)
    equal(lastLog().level, 'error')
  })
})
