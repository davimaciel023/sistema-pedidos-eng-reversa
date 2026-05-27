import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../entities/usuario.entity';
import { AppConfig } from '../../../shared/config/app-config.singleton';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly url = `${AppConfig.getInstance().apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  buscarPorTelefone(telefone: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}?telefone=${telefone}`);
  }
}
