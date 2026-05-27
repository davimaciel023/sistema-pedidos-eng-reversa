import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';

@Injectable({ providedIn: 'root' })
export class ProdutoController {

  constructor(private service: ProdutoService) {}

  listar(): Observable<Produto[]> {
    return this.service.listarProdutos();
  }

  buscar(id: number): Observable<Produto> {
    return this.service.buscarProduto(id);
  }
}
