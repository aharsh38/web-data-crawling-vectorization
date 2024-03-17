import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import { transports, format, Logger, createLogger } from 'winston';
import { Format } from 'logform';
import * as Transport from 'winston-transport';

export const localLogFormat = format.combine(
  format.colorize({ all: true }),
  format.simple(),
  format.printf(
    ({ level, message, timestamp, serviceName, traceId, stack }) => {
      return `${timestamp} ${traceId !== undefined ? `[${traceId}]` : ``} ${
        serviceName !== undefined ? `[${serviceName}]` : ``
      } [${level}] : ${message} ${stack !== undefined ? `\n[${stack}]` : ``}`;
    },
  ),
);

export const generateServiceName = (serviceName: string): Format => {
  return format((info) => {
    info.serviceName = serviceName;
    return info;
  })();
};

export const generateLogTransport = (
  env: string,
  serviceName: string,
  ...formats: Format[]
): Transport => {
  return new transports.Console({
    level: 'debug', // conditional in case of other env ie. info for prod
    format: format.combine(
      generateServiceName(serviceName),
      format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), // conditional in case of other env ie. format.timestamp(); for prod
      ...formats,
      localLogFormat, // conditional in case of other env ie. format.json(); for prod
    ),
  });
};

@Injectable()
export class LogService implements LoggerService {
  private readonly winstonLogger: Logger;
  constructor() {
    this.winstonLogger = createLogger({
      format: format.combine(format.errors({ stack: true })),
      transports: [
        generateLogTransport(
          process.env.ENV,
          'web-data-crawling-vectorization',
        ),
      ],
    });
  }

  log(message: any) {
    this.winstonLogger.info(message);
  }

  fatal?(message: any) {
    this.winstonLogger.warn(message);
  }

  setLogLevels?(levels: LogLevel[]) {
    console.log(levels);
  }

  debug(message: any): any {
    this.winstonLogger.debug(message);
  }

  info(message: any): any {
    this.winstonLogger.info(message);
  }

  verbose(message: any): any {
    this.winstonLogger.verbose(message);
  }

  warn(message: any): any {
    this.winstonLogger.warn(message);
  }

  error(message: any): any;
  error(message: string, ...meta: any[]): any;
  error(message: any, ...meta: any[]): any {
    this.winstonLogger.error(message, ...meta);
  }
}
