import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagamento } from '../entities/pagamento.entity';
import { AppConfig } from '../../../shared/config/app-config.singleton';

@Injectable({ providedIn: 'root' })
export class PagamentoRepository {
  private readonly url = `${AppConfig.getInstance().apiUrl}/pagamentos`;

  constructor(private http: HttpClient) {}

  registrar(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(this.url, pagamento);
  }

  listarPorPedido(pedidoId: number): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.url}?pedidoId=${pedidoId}`);
  }
}
