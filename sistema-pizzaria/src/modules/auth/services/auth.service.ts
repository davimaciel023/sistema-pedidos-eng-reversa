import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../entities/usuario.entity';
import { AuthRepository } from '../repositories/auth.repository';
import { LoggerService } from '../../../shared/utils/logger.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioAtivo: Usuario | null = null;

  constructor(
    private repo: AuthRepository,
    private logger: LoggerService
  ) {}

  autenticar(telefone: string): Observable<boolean> {
    return this.repo.buscarPorTelefone(telefone).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          this.usuarioAtivo = { ...usuarios[0], token: this.gerarToken() };
          this.logger.info(`Usuário autenticado: ${this.usuarioAtivo.nome}`);
          return true;
        }
        this.logger.info(`Autenticação falhou para telefone: ${telefone}`);
        return false;
      })
    );
  }

  getUsuarioAtivo(): Usuario | null {
    return this.usuarioAtivo;
  }

  getToken(): string | null {
    return this.usuarioAtivo?.token ?? null;
  }

  encerrarSessao(): void {
    this.logger.info('Sessão encerrada');
    this.usuarioAtivo = null;
  }

  private gerarToken(): string {
    return `fake-token-${Date.now()}`;
  }
}
