import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ItemPedido } from '../entities/item-pedido.entity';

export interface PedidoState {
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoObserverService {
  private pedidoAtualizado$ = new Subject<PedidoState>();

  readonly onPedidoAtualizado$ = this.pedidoAtualizado$.asObservable();

  notificar(state: PedidoState): void {
    this.pedidoAtualizado$.next(state);
  }
}
