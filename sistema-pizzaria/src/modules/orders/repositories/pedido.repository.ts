import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../entities/pedido.entity';
import { AppConfig } from '../../../shared/config/app-config.singleton';

@Injectable({ providedIn: 'root' })
export class PedidoRepository {
  private readonly url = `${AppConfig.getInstance().apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  salvar(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, pedido);
  }

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url);
  }
}
