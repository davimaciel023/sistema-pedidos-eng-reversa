export interface DescontoStrategy {
  calcular(total: number): number;
}

export class SemDesconto implements DescontoStrategy {
  calcular(total: number): number {
    return 0;
  }
}

export class DescontoPercentual implements DescontoStrategy {
  constructor(private percentual: number) {}
  calcular(total: number): number {
    return total * (this.percentual / 100);
  }
}

export class DescontoFixo implements DescontoStrategy {
  constructor(private valor: number) {}
  calcular(total: number): number {
    return Math.min(this.valor, total);
  }
}