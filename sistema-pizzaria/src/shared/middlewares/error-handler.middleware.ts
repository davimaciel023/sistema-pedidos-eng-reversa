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

@Injectable()
export class ErrorHandlerMiddleware implements HttpInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((erro: HttpErrorResponse) => {
        const mensagem = this.resolverMensagem(erro);
        this.logger.error(`[ErrorHandler] ${mensagem}`);
        return throwError(() => new Error(mensagem));
      })
    );
  }

  private resolverMensagem(erro: HttpErrorResponse): string {
    if (erro.status === 0) return 'Sem conexão com o servidor.';
    if (erro.status === 401) return 'Não autorizado.';
    if (erro.status === 404) return 'Recurso não encontrado.';
    if (erro.status >= 500) return 'Erro interno do servidor.';
    return `Erro inesperado: ${erro.message}`;
  }
}
