const { strict: { deepEqual } } = require('assert');

const { log } = console;
const called = [];
let logger;

describe('logger', () => {
	before(() => {
		console.log = function console_log(...args) {
			const [ first ] = args
			if (typeof first === 'string' && first?.startsWith('{')) {
				called.push(args)
				return;
			}
			return log.apply(console, args)
		}
		logger = require('.').logger
	})
	beforeEach(() => {
		called.length = 0
	})
	after(() => {
		console.log = log;
	})
	it('passes the JSON string to console.log', () => {
		logger.info('Hello', { key: 'Value' });
		const [ [ message ] ] = called;
		deepEqual(
			JSON.parse(message),
			{
				level: 'info',
				message: 'Hello',
				key: 'Value'
			}
		)
	})
})
