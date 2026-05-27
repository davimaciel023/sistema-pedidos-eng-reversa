import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../utils/logger.service';

const FAKE_TOKEN = 'fake-token-sistema-pedidos';

@Injectable()
export class AuthMiddleware implements HttpInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const autenticada = req.clone({
      setHeaders: { Authorization: `Bearer ${FAKE_TOKEN}` },
    });

    this.logger.info(`[AuthMiddleware] ${req.method} ${req.url}`);

    return next.handle(autenticada).pipe(
      catchError((erro: HttpErrorResponse) => {
        this.logger.error(`[AuthMiddleware] Erro ${erro.status}: ${req.url}`);
        return throwError(() => erro);
      })
    );
  }
}
