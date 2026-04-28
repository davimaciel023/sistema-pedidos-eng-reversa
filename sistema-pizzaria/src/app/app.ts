import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PedidoComponent } from './views/pedido/pedido';

@Component({
  selector: 'app-root',
  imports: [PedidoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sistema-pizzaria');
}
