import { Injectable } from '@angular/core';
import { Pedido } from '../entities/pedido.entity';
import { LoggerService } from '../../../shared/utils/logger.service';

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  constructor(private logger: LoggerService) {}

  enviarWhatsApp(pedido: Pedido): void {
    const resumo = this.gerarResumo(pedido);
    const msgCliente = encodeURIComponent(`Seu pedido foi recebido!\n${resumo}`);
    const msgEstab = encodeURIComponent(`Novo pedido recebido!\n${resumo}`);

    this.logger.info(`Notificando cliente: ${pedido.telefoneCliente}`);
    window.open(`https://wa.me/${pedido.telefoneCliente}?text=${msgCliente}`, '_blank');

    setTimeout(() => {
      this.logger.info(`Notificando estabelecimento: ${pedido.telefoneEstabelecimento}`);
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
