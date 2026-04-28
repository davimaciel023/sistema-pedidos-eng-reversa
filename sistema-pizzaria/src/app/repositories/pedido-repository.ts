import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { Produto } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class PedidoRepositoryService {

  private readonly urlPedidos = 'http://localhost:3000/pedidos';
  private readonly urlProdutos = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  salvarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.urlPedidos, pedido);
  }

  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.urlPedidos);
  }

  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.urlProdutos);
  }
}