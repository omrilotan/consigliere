import assert from 'assert'

const { strict: { deepEqual, equal } } = assert

export { deepEqual, equal }

const calls = new Map()

function drain (array) {
  array.length = 0
  return array
}

export function called (name, args) {
  switch (arguments.length) {
    case 0:
      calls.forEach(drain)
      return
    case 1:
      calls.has(name) || calls.set(name, [])
      return calls.get(name)
    case 2:
      calls.has(name) || calls.set(name, [])
      calls.get(name).push(args)
      return calls.get(name)
    default:
      throw new Error('Invalid arguments')
  }
}

const { log } = console
export function mockConsole () {
  console.log = function consoleLog (...args) {
    const [first] = args
    if (typeof first === 'string' && first?.startsWith('{')) {
      called(console.log, args)
      return
    }
    return log.apply(console, args)
  }
}
export function restoreConsole () {
  console.log = log
}
