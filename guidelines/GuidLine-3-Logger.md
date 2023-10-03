# Week 3 - Logger

## 1. Install libs

```bash
npm i nest-winston winston
```

## 2. Import WinstonModule into AppModule

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
