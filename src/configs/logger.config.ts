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
    // new winston.transports.File({
    //   format: loggerFormat,
    //   dirname: 'logs',
    //   filename: 'audit.log',
    // }),
    // new LogtailTransport(logtail),
  ],
  exitOnError: false,
};
