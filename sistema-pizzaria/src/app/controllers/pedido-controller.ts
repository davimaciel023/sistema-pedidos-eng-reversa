import { Injectable } from '@angular/core';
import { PedidoService } from '../services/pedido';
import { Produto } from '../models/produto.model';
import { Pedido } from '../models/pedido.model';

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
    this.service.aplicarDescontoPercentual(percentual);
  }

  aplicarDescontoFixo(valor: number): void {
    this.service.aplicarDescontoFixo(valor);
  }

  finalizar(telCliente: string, telEstab: string): void {
    const pedido = this.service.finalizarPedido(telCliente, telEstab);
    this.enviarWhatsApp(pedido);
    this.service.limparPedido();
  }

  private enviarWhatsApp(pedido: Pedido): void {
    const resumo = this.service.gerarMensagemWhatsApp(pedido);
    const msgCliente = encodeURIComponent(`Seu pedido foi recebido!\n${resumo}`);
    const msgEstab = encodeURIComponent(`Novo pedido recebido!\n${resumo}`);

    window.open(`https://wa.me/${pedido.telefoneCliente}?text=${msgCliente}`, '_blank');
    setTimeout(() => {
      window.open(`https://wa.me/${pedido.telefoneEstabelecimento}?text=${msgEstab}`, '_blank');
    }, 500);
  }
}
