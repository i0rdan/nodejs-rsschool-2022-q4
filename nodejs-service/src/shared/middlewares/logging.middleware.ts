import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private loggingService: LoggingService) {}

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, query, body } = request;
      const { statusCode, statusMessage } = response;

      const message = `${new Date().toLocaleString()} ${method}, ${originalUrl}, ${statusCode}, ${statusMessage}, query: ${JSON.stringify(
        query,
      )}, body: ${JSON.stringify(body)}`;

      if (statusCode >= HttpStatus.BAD_REQUEST) {
        return this.loggingService.warn(message);
      }

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return this.loggingService.error(message);
      }

      return this.loggingService.log(message);
    });

    next();
  }
}
