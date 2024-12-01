import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { LoggingService } from '../services/logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { url, method } = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let errResponse: Record<string, unknown> = {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Something wont wrong',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof HttpException) {
      const expResponse = exception.getResponse();
      if (typeof expResponse === 'string') {
        errResponse = {
          ...errResponse,
          statusCode: exception.getStatus(),
          error: expResponse,
        };
      } else {
        errResponse = {
          ...errResponse,
          ...expResponse,
        };
      }
    }
    const message = `[CustomExceptionFilter] ${new Date().toISOString()}, ${method}, ${url}, ${JSON.stringify(
      errResponse,
    )}`;

    this.loggingService.error(message);

    response.status(errResponse.statusCode as number).json(errResponse);
  }
}
