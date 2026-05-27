import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../entities/produto.entity';
import { AppConfig } from '../../../shared/config/app-config.singleton';

@Injectable({ providedIn: 'root' })
export class ProdutoRepository {
  private readonly url = `${AppConfig.getInstance().apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.url}/${id}`);
  }
}
