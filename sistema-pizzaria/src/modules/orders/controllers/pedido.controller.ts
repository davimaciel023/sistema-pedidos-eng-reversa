import { Injectable } from '@angular/core';
import { Produto } from '../../products/entities/produto.entity';
import { Pedido } from '../entities/pedido.entity';
import { PedidoService } from '../services/pedido.service';
import { NotificacaoService } from '../services/notificacao.service';

@Injectable({ providedIn: 'root' })
export class PedidoController {

  constructor(
    private service: PedidoService,
    private notificacao: NotificacaoService
  ) {}

  adicionar(produto: Produto, qtd: number = 1): void {
    this.service.adicionarItem(produto, qtd);
  }

  remover(produtoId: number): void {
    this.service.removerItem(produtoId);
  }

  aplicarDescontoPercentual(percentual: number): void {
    this.service.aplicarDescontoPercentual(percentual);
  }

  aplicarDescontoFixo(valor: number): void {
    this.service.aplicarDescontoFixo(valor);
  }

  finalizar(telCliente: string, telEstab: string): Pedido {
    const pedido = this.service.finalizarPedido(telCliente, telEstab);
    this.notificacao.enviarWhatsApp(pedido);
    this.service.limparPedido();
    return pedido;
  }
}
