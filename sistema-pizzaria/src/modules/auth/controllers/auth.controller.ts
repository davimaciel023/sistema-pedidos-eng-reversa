import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../entities/usuario.entity';

@Injectable({ providedIn: 'root' })
export class AuthController {

  constructor(private service: AuthService) {}

  autenticar(telefone: string): Observable<boolean> {
    return this.service.autenticar(telefone);
  }

  getUsuario(): Usuario | null {
    return this.service.getUsuarioAtivo();
  }

  encerrarSessao(): void {
    this.service.encerrarSessao();
  }
}
