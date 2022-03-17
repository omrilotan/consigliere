/* eslint-env mocha */

import { called, deepEqual, mockConsole, restoreConsole } from '../../../specHelpers/index.js'
import { log } from './index.js'

const lastLog = () => JSON.parse(
  called(console.log).at(-1).at(0)
)
const context = {}

describe('lib/log', () => {
  before(async () => {
    mockConsole()
    Object.assign(context, { level: 'info', device: console.log })
  })
  beforeEach(() => {
    called()
  })
  after(() => {
    called()
    restoreConsole()
  })
  it('Logs string message and enrichment', () => {
    log.call(context, 'Hello', { key: 'Value' })
    deepEqual(lastLog(), {
      level: 'info',
      message: 'Hello',
      key: 'Value'
    })
  })
  it('Logs objects', () => {
    log.call(context, { key: 'Value' })
    deepEqual(lastLog(), {
      level: 'info',
      key: 'Value'
    })
  })
  it('Parses error and enrichment', () => {
    const error = new TypeError('Something must have gone horribly wrong')
    Object.defineProperties(error, {
      info: { get: () => 'Information', enumerable: false },
      hidden: { get: () => 'Hidden', enumerable: false },
      visible: { get: () => 'Visible', enumerable: true }

    })
    error.unregistered = 'Unregistered'

    log.call(context, error, { key: 'Value' })

    deepEqual(lastLog(), {
      level: 'info',
      message: 'Something must have gone horribly wrong',
      name: 'TypeError',
      stack: error.stack,
      key: 'Value',
      info: 'Information',
      visible: 'Visible',
      unregistered: 'Unregistered'
    })
  })
  it('Coerces arrays', () => {
    log.call(context, [1, 2, 3])
    deepEqual(lastLog(), {
      level: 'info',
      message: '1, 2, 3'
    })
  })
  it('Coerces other things into strings', () => {
    log.call(context, new Map(), { key: 'Value' })
    deepEqual(lastLog(), {
      level: 'info',
      message: '[object Map]',
      key: 'Value'
    })
  })
  it('Normalises nested fields', () => {
    log.call(context, { key: { key: 'Value' } })
    deepEqual(lastLog(), {
      level: 'info',
      key: '[object Object]'
    })
  })
  it('Normalises array items', () => {
    log.call(context, [{ key: 'Value' }, { key: 'Value' }])
    deepEqual(lastLog(), {
      level: 'info',
      message: '[object Object], [object Object]'
    })
  })
})
