# consigliere

🍝 A simple to use JSON logger

## Quick use logger

Zero configuration logger out-of-the box use

```js
import { logger } from "consigliere";

logger.debug("Something just happened", { detail: "Something" });
// {"message":"Something just happened","detail":"Something","level":"debug"}

logger.error(new Error("Something must have gone horribly wrong"));
// {"message":"Something must have gone horribly wrong","stack":"Error: Something must have gone horribly wrong\n    at…","name":"Error","level":"error"}
```

| ![](https://user-images.githubusercontent.com/516342/134087468-7c45d5c6-dd07-4428-b6b2-76133817fdd4.gif)
| -

## Create new Logger instances

```js
import { Logger } from "consigliere";

const logger = new Logger();
```

## Change minimal log level

Silence anything below a certain log level

```js
import { Logger } from "consigliere";

const logger = new Logger({ level: "warn" });
logger.info("I have a message to relay"); // nothing happens

logger.warn("Something worrying happened"); // logs record
```

## Use any log levels

```js
import { Logger } from "consigliere";

const logger = new Logger({
  levels: ["low", "medium", "high"],
  level: "medium",
});
logger.low("I have something to show you");
// nothing
logger.medium("I have a message to relay");
// {"message":"I have a message to relay","level":"low"}

logger.warn("Something worrying happened"); // logs
```

## Define alternative logging device

```js
import { Logger } from "consigliere";

const logger = new Logger({
  device: (json) => navigator.sendBeacon("/log", json),
});
```

## Customise output with "parser"

```js
import { Logger, NORMALISE_VALUES, NORMALISE, RAW } from "consigliere";

// JSON string
const logger = new Logger();
const logger = new Logger({ parser: NORMALISE });

// output the raw object
const logger = new Logger({ parser: false });
const logger = new Logger({ parser: RAW });

// Stringify values of the record object
const logger = new Logger({ parser: NORMALISE_VALUES });

// Custom function
const logger = new Logger({
  parser: function ({ application, ...record }) {
    return JSON.stringify({
      application,
      level: this.level,
      records: [record],
    });
  },
});
```

## Add constant fields to each record for the logger

```js
import { Logger } from "consigliere";

const logger = new Logger({
  fields: {
    application: "my-app",
    version: "0.0.1",
  },
});
```
