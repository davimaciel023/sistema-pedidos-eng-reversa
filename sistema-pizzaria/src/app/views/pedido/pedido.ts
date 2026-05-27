import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PedidoService } from '../../services/pedido';
import { PedidoControllerService } from '../../controllers/pedido-controller';
import { PedidoObserverService, PedidoState } from '../../services/pedido-observer.service';
import { PedidoRepositoryService } from '../../repositories/pedido-repository';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css'
})
export class PedidoComponent implements OnInit, OnDestroy {

  produtos = signal<Produto[]>([]);
  pedidoState = signal<PedidoState>({ itens: [], subtotal: 0, desconto: 0, total: 0 });

  telCliente = '';
  telEstab = '';
  desconto = 0;

  private subscription = new Subscription();

  constructor(
    public service: PedidoService,
    public ctrl: PedidoControllerService,
    private observer: PedidoObserverService,
    private repo: PedidoRepositoryService
  ) {}

  ngOnInit(): void {
    this.repo.listarProdutos().subscribe(p => this.produtos.set(p));

    this.subscription.add(
      this.observer.onPedidoAtualizado$.subscribe(state => {
        this.pedidoState.set(state);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
