import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido';
import { PedidoControllerService } from '../../controllers/pedido-controller';
import { PedidoRepositoryService } from '../../repositories/pedido-repository';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css'
})
export class PedidoComponent implements OnInit {

  produtos = signal<Produto[]>([]);
  telCliente = '';
  telEstab = '';
  desconto = 0;

  constructor(
    public service: PedidoService,
    public ctrl: PedidoControllerService,
    private repo: PedidoRepositoryService
  ) {}

  ngOnInit(): void {
    this.repo.listarProdutos().subscribe(p => this.produtos.set(p));
  }

  aplicarDesconto(): void {
    this.ctrl.aplicarDescontoPercentual(this.desconto);
  }

  finalizar(): void {
    if (!this.telCliente || !this.telEstab) {
      alert('Preencha os telefones!');
      return;
    }
    this.ctrl.finalizar(this.telCliente, this.telEstab);
    this.telCliente = '';
    this.telEstab = '';
    this.desconto = 0;
  }
}