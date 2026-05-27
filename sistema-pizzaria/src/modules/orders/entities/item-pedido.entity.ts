import { Produto } from '../../products/entities/produto.entity';

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}
