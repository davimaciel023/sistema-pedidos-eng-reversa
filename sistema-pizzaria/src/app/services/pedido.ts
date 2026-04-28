import { Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto.model';
import { ItemPedido } from '../models/item-pedido.model';
import { Pedido } from '../models/pedido.model';
import { DescontoStrategy, SemDesconto } from './desconto.strategy';
import { ProdutoFactory } from './produto.factory';
import { PedidoRepositoryService } from '../repositories/pedido-repository';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  itens = signal<ItemPedido[]>([]);
  total = signal<number>(0);

  private strategy: DescontoStrategy = new SemDesconto();

  constructor(private repo: PedidoRepositoryService) {}

  setStrategy(strategy: DescontoStrategy): void {
    this.strategy = strategy;
    this.recalcularTotal();
  }

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

  private recalcularTotal(): void {
    const subtotal = this.itens().reduce((acc, i) => acc + i.subtotal, 0);
    this.total.set(subtotal - this.strategy.calcular(subtotal));
  }

  get desconto(): number {
    const subtotal = this.itens().reduce((acc, i) => acc + i.subtotal, 0);
    return this.strategy.calcular(subtotal);
  }

  get subtotal(): number {
    return this.itens().reduce((acc, i) => acc + i.subtotal, 0);
  }

  limparPedido(): void {
    this.itens.set([]);
    this.total.set(0);
    this.strategy = new SemDesconto();
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

  enviarWhatsApp(pedido: Pedido): void {
    const resumo = this.gerarResumo(pedido);
    const msgCliente = encodeURIComponent(`Seu pedido foi recebido!\n${resumo}`);
    const msgEstab = encodeURIComponent(`Novo pedido recebido!\n${resumo}`);

    window.open(`https://wa.me/${pedido.telefoneCliente}?text=${msgCliente}`, '_blank');
    setTimeout(() => {
      window.open(`https://wa.me/${pedido.telefoneEstabelecimento}?text=${msgEstab}`, '_blank');
    }, 500);
  }

  private gerarResumo(pedido: Pedido): string {
    const itens = pedido.itens
      .map(i => `- ${i.produto.nome} x${i.quantidade} = R$ ${i.subtotal.toFixed(2)}`)
      .join('\n');
    return `${itens}\nDesconto: R$ ${pedido.desconto.toFixed(2)}\nTotal: R$ ${pedido.totalComDesconto.toFixed(2)}`;
  }
}