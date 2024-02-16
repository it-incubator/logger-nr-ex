import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '@app/my-library/logger/logger.service';

const getDefaultResponseHttpBody = (status: number) => ({
  statusCode: status,
  timestamp: new Date().toISOString(),
  path: null,
  message: 'Some error occurred',
  errorDescription: null,
});

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private isNonProduction: boolean,
    private logger: CustomLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    this.logger.error(exception, 'All exception filter');

    try {
      //TODO: move this logic to another exception filter (for body validation)
      const isHttpException = exception instanceof HttpException;
      const exceptionResponse = isHttpException
        ? (exception.getResponse() as ExceptionResponseType)
        : null;
      const message = isHttpException
        ? exception?.message
        : exception?.message || 'Some error';
      const errorDescription = Array.isArray(exceptionResponse?.message)
        ? exceptionResponse?.message
        : null;

      const status = isHttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      if (this.isNonProduction || status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        response.status(status).json({
          ...getDefaultResponseHttpBody(status),
          path: request.url,
          message,
          errorDescription,
        });

        return;
      }

      //if INTERNAL_SERVER_ERROR on production
      response
        .status(status)
        .json(getDefaultResponseHttpBody(HttpStatus.INTERNAL_SERVER_ERROR));
    } catch (error) {
      console.log('All EXCEPTIONS CATCH:', error);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(getDefaultResponseHttpBody(HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}

type ExceptionResponseType = {
  statusCode: number;
  message: { message: string; field: string }[];
  error: string;
};
