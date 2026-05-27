import { Produto } from '../entities/produto.entity';
import { ItemPedido } from '../../orders/entities/item-pedido.entity';

export class ItemPedidoFactory {
  static criar(produto: Produto, quantidade: number): ItemPedido {
    return {
      produto,
      quantidade,
      subtotal: produto.preco * quantidade,
    };
  }
}
