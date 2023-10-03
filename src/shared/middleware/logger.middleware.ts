import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
