import { Produto } from './produto.model';

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}