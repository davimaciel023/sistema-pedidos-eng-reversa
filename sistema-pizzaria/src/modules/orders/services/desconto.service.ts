import { Injectable } from '@angular/core';
import { DescontoStrategy, SemDesconto, DescontoPercentual, DescontoFixo } from './desconto.strategy';

@Injectable({ providedIn: 'root' })
export class DescontoService {
  private strategy: DescontoStrategy = new SemDesconto();

  setPercentual(percentual: number): void {
    this.strategy = percentual > 0 ? new DescontoPercentual(percentual) : new SemDesconto();
  }

  setFixo(valor: number): void {
    this.strategy = valor > 0 ? new DescontoFixo(valor) : new SemDesconto();
  }

  calcular(subtotal: number): number {
    return this.strategy.calcular(subtotal);
  }

  resetar(): void {
    this.strategy = new SemDesconto();
  }
}
