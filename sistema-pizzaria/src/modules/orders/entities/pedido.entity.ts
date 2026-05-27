import { ItemPedido } from './item-pedido.entity';

export interface Pedido {
  id?: number;
  itens: ItemPedido[];
  total: number;
  desconto: number;
  totalComDesconto: number;
  telefoneCliente: string;
  telefoneEstabelecimento: string;
  criadoEm: Date;
}
