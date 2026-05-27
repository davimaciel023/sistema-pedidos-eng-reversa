import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagamento, MetodoPagamento } from '../entities/pagamento.entity';
import { PagamentoRepository } from '../repositories/pagamento.repository';
import { LoggerService } from '../../../shared/utils/logger.service';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  constructor(
    private repo: PagamentoRepository,
    private logger: LoggerService
  ) {}

  registrarPagamento(pedidoId: number, valor: number, metodo: MetodoPagamento): Observable<Pagamento> {
    const pagamento: Pagamento = {
      pedidoId,
      valor,
      metodo,
      realizadoEm: new Date(),
    };

    this.logger.info(`Registrando pagamento — pedido #${pedidoId}, método: ${metodo}, valor: R$ ${valor.toFixed(2)}`);
    return this.repo.registrar(pagamento);
  }

  listarPagamentos(pedidoId: number): Observable<Pagamento[]> {
    return this.repo.listarPorPedido(pedidoId);
  }
}
