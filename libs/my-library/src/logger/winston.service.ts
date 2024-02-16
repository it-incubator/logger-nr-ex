import * as winston from 'winston';
import * as Transport from 'winston-transport';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ConfigurationType } from '../../../../apps/users/src/settings/configuration';

const customLevels = {
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
};

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const { combine, prettyPrint, timestamp, errors, colorize } = winston.format;

@Injectable()
export class WinstonService {
  private logger: winston.Logger;
  //private serviceName = 'user micriservice';

  constructor(
    private configService: ConfigService<ConfigurationType, true>,
    private serviceName: string,
  ) {
    const loggerSettings = this.configService.get('loggerEnvironmentSettings', {
      infer: true,
    });

    const consoleTransport = new winston.transports.Console({
      format: combine(
        timestamp({ format: timeFormat }),
        errors({ stack: true }),
        prettyPrint(),
        colorize({ all: true, colors: { trace: 'yellow' } }),
      ),
    });

    const transports: Transport[] = [consoleTransport];

    const isProduction = this.configService.get('environmentSettings', {
      infer: true,
    }).isProduction;

    if (isProduction) {
      const httpTransport = new winston.transports.Http({
        host: loggerSettings.HOST,
        path: loggerSettings.URL_PATH,
        ssl: true,
      });

      transports.push(httpTransport);
    }

    this.logger = winston.createLogger({
      format: winston.format.timestamp({ format: timeFormat }),
      level: loggerSettings.LOGGER_LEVEL,
      levels: customLevels.levels,
      transports: transports,
      defaultMeta: { serviceName: this.serviceName },
    });
  }

  trace(
    message: string,
    requestId: string | null,
    functionName?: string,
    sourceName?: string,
  ) {
    this.logger.log('trace', message, {
      sourceName,
      functionName,
      requestId,
    });
  }

  debug(
    message: string,
    requestId: string | null,
    functionName?: string,
    sourceName?: string,
  ) {
    this.logger.debug(message, {
      sourceName,
      functionName,
      requestId,
    });
  }

  info(
    message: string,
    requestId: string | null,
    functionName?: string,
    sourceName?: string,
  ) {
    this.logger.info(message, {
      sourceName,
      functionName,
      requestId,
    });
  }

  warn(
    message: string,
    requestId: string | null,
    functionName?: string,
    sourceName?: string,
  ) {
    this.logger.warn(message, {
      sourceName,
      functionName,
      requestId,
    });
  }

  error(
    message: string,
    requestId: string | null,
    functionName?: string,
    sourceName?: string,
    stack?: string,
  ) {
    this.logger.error(message, {
      sourceName,
      functionName,
      requestId,
      stack,
    });
  }

  fatal(
    message: string,
    requestId: string | null,
    functionName?: string,
    sourceName?: string,
    stack?: string,
  ) {
    this.logger.log('fatal', message, {
      sourceName,
      functionName,
      requestId,
      stack,
    });
  }
}
