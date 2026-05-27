import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagamento, MetodoPagamento } from '../entities/pagamento.entity';
import { PagamentoService } from '../services/pagamento.service';

@Injectable({ providedIn: 'root' })
export class PagamentoController {

  constructor(private service: PagamentoService) {}

  registrar(pedidoId: number, valor: number, metodo: MetodoPagamento): Observable<Pagamento> {
    return this.service.registrarPagamento(pedidoId, valor, metodo);
  }

  listar(pedidoId: number): Observable<Pagamento[]> {
    return this.service.listarPagamentos(pedidoId);
  }
}
