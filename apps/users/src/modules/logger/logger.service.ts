import {
  ConsoleLogger,
  ConsoleLoggerOptions,
} from '@nestjs/common/services/console-logger.service';
import { Injectable, Scope } from '@nestjs/common';
import { WinstonService } from './winston.service';
import { AsyncLocalStorageService } from '../../common/async-local-storage.service';
import { REQUEST_ID_KEY } from '../../common/middleware/request-context.middleware';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    private winstonLogger: WinstonService,
    private asyncLocalStorageService: AsyncLocalStorageService,
  ) {
    super(context, {
      ...options,
      logLevels: ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'],
    });
  }

  private getRequestId(): string | null {
    return (
      this.asyncLocalStorageService.getStore()?.get(REQUEST_ID_KEY) || null
    );
  }

  private getSourceContext(): string | undefined {
    return this.context;
  }

  private getStack(error: any): string | undefined {
    const stack = error?.stack;

    if (stack) {
      return `${stack?.split('\n')[1]}`;
    }
  }

  trace(message: string, functionName?: string) {
    super.verbose(message, this.getSourceContext() || functionName);

    this.winstonLogger.trace(
      message,
      this.getRequestId(),
      functionName,
      this.getSourceContext(),
    );
  }

  debug(message: string, functionName?: string) {
    super.debug(message, this.getSourceContext() || functionName);

    this.winstonLogger.debug(
      message,
      this.getRequestId(),
      functionName,
      this.getSourceContext(),
    );
  }

  log(message: string, functionName?: string) {
    super.log(message, this.getSourceContext() || functionName);

    this.winstonLogger.info(
      message,
      this.getRequestId(),
      functionName,
      this.getSourceContext(),
    );
  }

  warn(message: string, functionName?: string) {
    super.warn(message, this.getSourceContext() || functionName);

    this.winstonLogger.warn(
      message,
      this.getRequestId(),
      functionName,
      this.getSourceContext(),
    );
  }

  error(error: any, functionName?: string) {
    const jsonError = error instanceof Error ? JSON.stringify(error) : error;
    const stack = this.getStack(error);

    const fullErrorMessage = `${
      error?.message ? `msg: ${error?.message}; ` : ''
    } fullError: ${jsonError}`;

    super.error(error, stack, this.getSourceContext() || functionName);

    this.winstonLogger.error(
      fullErrorMessage,
      this.getRequestId(),
      functionName,
      this.getSourceContext(),
      stack,
    );
  }

  fatal(message: string, functionName?: string, stack?: string) {
    super.fatal(message, this.getSourceContext() || functionName);

    this.winstonLogger.fatal(
      message,
      this.getRequestId(),
      functionName,
      this.getSourceContext(),
      stack,
    );
  }
}
