export type MetodoPagamento = 'dinheiro' | 'cartao' | 'pix';

export interface Pagamento {
  id?: number;
  pedidoId: number;
  valor: number;
  metodo: MetodoPagamento;
  realizadoEm: Date;
}
