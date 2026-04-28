import { Injectable } from '@angular/core';
import { PedidoService } from '../services/pedido';
import { Produto } from '../models/produto.model';
import { DescontoPercentual, DescontoFixo, SemDesconto } from '../services/desconto.strategy';

@Injectable({ providedIn: 'root' })
export class PedidoControllerService {

  constructor(private service: PedidoService) {}

  adicionar(produto: Produto, qtd: number = 1): void {
    this.service.adicionarItem(produto, qtd);
  }

  remover(produtoId: number): void {
    this.service.removerItem(produtoId);
  }

  aplicarDescontoPercentual(percentual: number): void {
    this.service.setStrategy(
      percentual > 0 ? new DescontoPercentual(percentual) : new SemDesconto()
    );
  }

  aplicarDescontoFixo(valor: number): void {
    this.service.setStrategy(
      valor > 0 ? new DescontoFixo(valor) : new SemDesconto()
    );
  }

  finalizar(telCliente: string, telEstab: string): void {
    const pedido = this.service.finalizarPedido(telCliente, telEstab);
    this.service.enviarWhatsApp(pedido);
    this.service.limparPedido();
  }
}