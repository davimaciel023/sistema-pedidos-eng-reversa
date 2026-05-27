# Parte 1 — Engenharia Reversa da Arquitetura MVC Atual

## Como o MVC atual está organizado?

O sistema utiliza Angular com a seguinte separação de camadas:

```
src/app/
  models/          → Produto, Pedido, ItemPedido
  services/        → PedidoService, DescontoService, Observer, Singleton, Factory
  repositories/    → PedidoRepositoryService
  controllers/     → PedidoControllerService
  views/pedido/    → PedidoComponent (View)
```

Há uma tentativa de MVC, mas todas as camadas estão dentro de `src/app/` sem separação por domínio. Qualquer módulo novo (produtos, pagamentos, auth) seria adicionado nessa mesma pasta, causando crescimento desordenado.

---

## Problemas Arquiteturais Encontrados

### 1. Controllers Gordos

O `PedidoControllerService` possui lógica de negócio que não deveria estar ali. O método `enviarWhatsApp` constrói URLs, codifica mensagens e abre janelas do browser — isso é regra de negócio de notificação, não responsabilidade do controller.

```typescript
// Problema: lógica de negócio dentro do controller
private enviarWhatsApp(pedido: Pedido): void {
  const resumo = this.service.gerarMensagemWhatsApp(pedido);
  const msgCliente = encodeURIComponent(`Seu pedido foi recebido!\n${resumo}`);
  window.open(`https://wa.me/${pedido.telefoneCliente}?text=${msgCliente}`, '_blank');
}
```

### 2. Responsabilidades Misturadas na View

O `PedidoComponent` (view) injeta diretamente o `PedidoRepositoryService` e chama `repo.listarProdutos()`. A view não deveria falar diretamente com o repositório — isso viola o fluxo Controller → Service → Repository.

```typescript
// Problema: view acessando repositório diretamente
constructor(
  public service: PedidoService,
  public ctrl: PedidoControllerService,
  private observer: PedidoObserverService,
  private repo: PedidoRepositoryService  // ← view não deveria depender do repo
) {}

ngOnInit(): void {
  this.repo.listarProdutos().subscribe(p => this.produtos.set(p)); // ← acesso direto
}
```

### 3. Tudo no Domínio Único (`app/`)

Produtos, pedidos, descontos, observer, factory e singleton vivem todos no mesmo nível. Não existe separação por domínio. Se fosse adicionar autenticação ou pagamentos, onde entrariam?

```
src/app/services/
  app-config.singleton.ts   ← config global
  desconto.service.ts       ← regra de negócio de pedido
  desconto.strategy.ts      ← estratégia de desconto
  pedido-observer.service.ts ← notificação
  pedido.ts                 ← serviço principal
  produto.factory.ts        ← criação de produto
```

Seis arquivos com responsabilidades completamente diferentes numa mesma pasta chamada `services/`.

### 4. Repositório Misturando Domínios

O `PedidoRepositoryService` é responsável tanto por pedidos quanto por produtos:

```typescript
// Problema: um repositório gerencia dois domínios distintos
salvarPedido(pedido: Pedido): Observable<Pedido> { ... }
listarPedidos(): Observable<Pedido[]> { ... }
listarProdutos(): Observable<Produto[]> { ... }  // ← não é responsabilidade deste repo
```

### 5. Dificuldade de Navegação

Para encontrar onde um produto é criado, é preciso procurar em `services/produto.factory.ts`. Para encontrar onde o desconto é calculado, `services/desconto.service.ts`. Não há organização por domínio que guie o desenvolvedor.

### 6. Baixa Preparação para Crescimento

O sistema não suporta adicionar facilmente:
- Autenticação de usuários
- Módulo de pagamento
- Módulo de produtos com CRUD completo
- Diferentes perfis de usuário (admin, cliente)

Qualquer nova funcionalidade seria jogada em `services/` ou `controllers/`, aprofundando o caos.

---

## Resumo dos Problemas

| Problema | Onde ocorre | Impacto |
|---|---|---|
| Controller com lógica de negócio | `pedido-controller.ts` | Dificulta testes e reutilização |
| View acessando repositório diretamente | `pedido.ts` (component) | Viola fluxo MVC |
| Repositório com dois domínios | `pedido-repository.ts` | Baixa coesão |
| Pastas sem separação por domínio | `services/` inteiro | Crescimento desordenado |
| Ausência de módulo de auth | Geral | Sem controle de acesso |
| Sem middleware de interceptação | Geral | Sem log, sem validação global |
