import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogService } from '../logger/logger.service';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    this.logger.info({
      data: request.body,
      endpoint: request.route.path,
      method: request.method,
      protocol: context.getType(),
    });
    return next.handle().pipe(catchError((err) => throwError(err)));
  }
}
