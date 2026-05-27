import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../entities/produto.entity';
import { ProdutoRepository } from '../repositories/produto.repository';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  constructor(private repo: ProdutoRepository) {}

  listarProdutos(): Observable<Produto[]> {
    return this.repo.listarTodos();
  }

  buscarProduto(id: number): Observable<Produto> {
    return this.repo.buscarPorId(id);
  }
}
