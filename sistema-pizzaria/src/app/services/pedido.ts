import { Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto.model';
import { ItemPedido } from '../models/item-pedido.model';
import { Pedido } from '../models/pedido.model';
import { ProdutoFactory } from './produto.factory';
import { DescontoService } from './desconto.service';
import { PedidoObserverService } from './pedido-observer.service';
import { PedidoRepositoryService } from '../repositories/pedido-repository';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  itens = signal<ItemPedido[]>([]);
  total = signal<number>(0);

  constructor(
    private repo: PedidoRepositoryService,
    private descontoService: DescontoService,
    private observer: PedidoObserverService
  ) {}

  adicionarItem(produto: Produto, quantidade: number = 1): void {
    const existente = this.itens().find(i => i.produto.id === produto.id);

    if (existente) {
      this.itens.update(itens =>
        itens.map(i =>
          i.produto.id === produto.id
            ? { ...i, quantidade: i.quantidade + quantidade, subtotal: i.produto.preco * (i.quantidade + quantidade) }
            : i
        )
      );
    } else {
      this.itens.update(itens => [...itens, ProdutoFactory.criarItemPedido(produto, quantidade)]);
    }

    this.recalcularTotal();
  }

  removerItem(produtoId: number): void {
    this.itens.update(itens => itens.filter(i => i.produto.id !== produtoId));
    this.recalcularTotal();
  }

  aplicarDescontoPercentual(percentual: number): void {
    this.descontoService.setPercentual(percentual);
    this.recalcularTotal();
  }

  aplicarDescontoFixo(valor: number): void {
    this.descontoService.setFixo(valor);
    this.recalcularTotal();
  }

  get desconto(): number {
    return this.descontoService.calcular(this.subtotal);
  }

  get subtotal(): number {
    return this.itens().reduce((acc, i) => acc + i.subtotal, 0);
  }

  finalizarPedido(telefoneCliente: string, telefoneEstabelecimento: string): Pedido {
    const pedido: Pedido = {
      itens: this.itens(),
      total: this.subtotal,
      desconto: this.desconto,
      totalComDesconto: this.total(),
      telefoneCliente,
      telefoneEstabelecimento,
      criadoEm: new Date(),
    };

    this.repo.salvarPedido(pedido).subscribe();
    return pedido;
  }

  gerarMensagemWhatsApp(pedido: Pedido): string {
    const itens = pedido.itens
      .map(i => `- ${i.produto.nome} x${i.quantidade} = R$ ${i.subtotal.toFixed(2)}`)
      .join('\n');
    return `${itens}\nDesconto: R$ ${pedido.desconto.toFixed(2)}\nTotal: R$ ${pedido.totalComDesconto.toFixed(2)}`;
  }

  limparPedido(): void {
    this.itens.set([]);
    this.total.set(0);
    this.descontoService.resetar();
    this.notificarObservadores();
  }

  private recalcularTotal(): void {
    const novoTotal = this.subtotal - this.desconto;
    this.total.set(novoTotal);
    this.notificarObservadores();
  }

  private notificarObservadores(): void {
    this.observer.notificar({
      itens: this.itens(),
      subtotal: this.subtotal,
      desconto: this.desconto,
      total: this.total(),
    });
  }
}
