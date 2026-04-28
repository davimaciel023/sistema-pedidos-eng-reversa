import { Produto } from '../models/produto.model';
import { ItemPedido } from '../models/item-pedido.model';

export class ProdutoFactory {
  static criarItemPedido(produto: Produto, quantidade: number): ItemPedido {
    return {
      produto,
      quantidade,
      subtotal: produto.preco * quantidade,
    };
  }
}