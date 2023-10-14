# Week 3 - Logger

## 1. Install libs

```bash
npm i nest-winston winston
```

## 2. Import WinstonModule into AppModule

```ts
// app.module.ts
WinstonModule.forRoot({ ...loggerConfig }),
```

```ts
// logger.config.ts
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const loggerFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('Sakila', {
    colors: true,
    prettyPrint: true,
  }),
);

const LOGTAIL_TOKEN = 'KavP3Nd3yHiFTF7AWf5nhpwk';
const logtail = new Logtail(LOGTAIL_TOKEN);

export const loggerConfig = {
  transports: [
    new winston.transports.Console({ format: loggerFormat }),
    new winston.transports.DailyRotateFile({
      format: loggerFormat,
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      handleExceptions: true,
      json: false,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '2d',
    }),
    new winston.transports.File({
      format: loggerFormat,
      dirname: 'logs',
      filename: 'audit.log',
    }),
    new LogtailTransport(logtail),
  ],
  exitOnError: false,
};
```

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private loggerService: LoggerService,
  ) {}
  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl } = request;
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const logs = [method, originalUrl, statusCode, statusMessage];
      if (hasBody) {
        logs.push(` - Body: ${JSON.stringify(request.body)}`);
      }
      const level = statusCode >= 400 ? 'error' : 'log';
      this.loggerService[level](logs.join(' '));
    });
    return next();
  }
}
```

## 3. Monitoring using LogTail

- **Set up LogTail**
  - Register here [LogTail](https://logs.betterstack.com/)
  - Create a new dashboard
  - Create a source
    - Get token
    - Configure settings
- **Install libs**:

```bash
npm install @logtail/node @logtail/winston
```

- **Integrate into app**

```ts
// Import module
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

// New instance
const LOGTAIL_TOKEN = <<LOGTAIL_TOKEN>>;
const logtail = new Logtail(LOGTAIL_TOKEN);

// Add new transport to Logger
new LogtailTransport(logtail)
```

- **Free Plan**
  - 1 GB per month
  - 3-day retention
  - 5 data sources
