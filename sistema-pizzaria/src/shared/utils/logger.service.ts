import { Injectable } from '@angular/core';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private log(level: LogLevel, mensagem: string): void {
    const timestamp = new Date().toISOString();
    const entrada = `[${timestamp}] [${level}] ${mensagem}`;
    if (level === 'ERROR') {
      console.error(entrada);
    } else if (level === 'WARN') {
      console.warn(entrada);
    } else {
      console.log(entrada);
    }
  }

  info(mensagem: string): void {
    this.log('INFO', mensagem);
  }

  warn(mensagem: string): void {
    this.log('WARN', mensagem);
  }

  error(mensagem: string): void {
    this.log('ERROR', mensagem);
  }
}
