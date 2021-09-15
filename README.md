# consigliere

🍝 A simple to use JSON logger

## Quick use logger
Zero configuration logger out-of-the box use

```js
import { logger } from 'consigliere'

logger.debug('Something just happened', { detail: 'Something' })
// {"message":"Something just happened","detail":"Something","level":"debug"}

logger.error(new Error('Something must have gone horribly wrong'))
// {"message":"Something must have gone horribly wrong","stack":"Error: Something must have gone horribly wrong\n    at…","name":"Error","level":"error"}
```

## Create new Logger instances

```js
import { Logger } from 'consigliere'

const logger = new Logger()
```

## Change minimal log level
Silence anything below a certain log level

```js
import { Logger } from 'consigliere'

const logger = new Logger({ level: 'warn' })
logger.info('I have a message to relay') // nothing happens

logger.warn('Something worrying happened') // logs record
```

## Use any log levels

```js
import { Logger } from 'consigliere'

const logger = new Logger({ levels: [ 'low', 'medium', 'high' ], level: 'medium' })
logger.low('I have something to show you')
// nothing
logger.medium('I have a message to relay')
// {"message":"I have a message to relay","level":"low"}

logger.warn('Something worrying happened') // logs
```

## Define alternative logging device
```js
import { Logger } from 'consigliere'

const logger = new Logger({
	device: json => navigator.sendBeacon(
		'/log',
		new Blob([ json ], { type : 'application/json' })
	)
})
```
