# Parte 9 — Diagrama de Módulos e Fluxo Arquitetural

## Diagrama de Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        src/modules/                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    orders    │  │   products   │  │     payments     │  │
│  │──────────────│  │──────────────│  │──────────────────│  │
│  │ controllers/ │  │ controllers/ │  │  controllers/    │  │
│  │ services/    │  │ services/    │  │  services/       │  │
│  │ repositories/│  │ repositories/│  │  repositories/   │  │
│  │ entities/    │  │ entities/    │  │  entities/       │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│         └─────────────────┼────────────────────┘            │
│                           │                                 │
│                    ┌──────▼───────┐                         │
│                    │     auth     │                         │
│                    │──────────────│                         │
│                    │ controllers/ │                         │
│                    │ services/    │                         │
│                    │ repositories/│                         │
│                    │ entities/    │                         │
│                    └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                           │
                    depende de
                           │
┌─────────────────────────────────────────────────────────────┐
│                        src/shared/                          │
│                                                             │
│  ┌──────────────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │   middlewares/   │  │  utils/  │  │     config/       │  │
│  │──────────────────│  │──────────│  │───────────────────│  │
│  │ auth.middleware  │  │ logger   │  │ AppConfig         │  │
│  │ error-handler    │  │          │  │ (Singleton)       │  │
│  └──────────────────┘  └──────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Dependências entre módulos

- `orders` depende de `products` (usa `Produto` e `ItemPedidoFactory`)
- `orders` depende de `shared` (Logger, AppConfig)
- `products` depende de `shared` (AppConfig)
- `payments` depende de `shared` (Logger, AppConfig)
- `auth` depende de `shared` (Logger, AppConfig)
- `shared` não depende de nenhum módulo de domínio

---

## Fluxo Arquitetural

```
Request (View/Component)
        │
        ▼
  Controller          ← orquestra, não contém lógica
        │
        ▼
   Service            ← regras de negócio, cálculos, validações
        │
        ▼
  Repository          ← acesso a dados (HTTP/banco)
        │
        ▼
   Database           ← JSON Server / API
```

### Exemplo concreto — finalizar pedido

```
PedidoComponent.finalizar()
        │
        ▼
PedidoController.finalizar(telCliente, telEstab)
        │
        ├──▶ PedidoService.finalizarPedido()
        │           │
        │           ├──▶ PedidoRepository.salvar(pedido)
        │           │           │
        │           │           └──▶ HTTP POST /pedidos
        │           │
        │           └──▶ PedidoObserverService.notificar()
        │
        └──▶ NotificacaoService.enviarWhatsApp(pedido)
                    │
                    └──▶ LoggerService.info()
```

---

# Parte 11 — Organização da Equipe (Simulação Jira/Sprint)

## Backlog — Sprint 1: Migração para Arquitetura Modular

| ID | Tipo | Título | Responsável | Status | Prioridade |
|---|---|---|---|---|---|
| MOD-001 | Task | Criar estrutura de pastas dos módulos (orders, products, payments, auth, shared) | Davi | Done | Alta |
| MOD-002 | Task | Migrar entidades para módulos corretos (Produto, Pedido, ItemPedido) | Davi | Done | Alta |
| MOD-003 | Refactor | Extrair lógica de notificação WhatsApp do controller para NotificacaoService | Davi | Done | Alta |
| MOD-004 | Refactor | Separar PedidoRepositoryService em PedidoRepository e ProdutoRepository | Davi | Done | Alta |
| MOD-005 | Feature | Implementar AuthMiddleware e ErrorHandlerMiddleware em shared/middlewares | Davi | Done | Média |
| MOD-006 | Feature | Criar LoggerService centralizado em shared/utils | Davi | Done | Média |
| MOD-007 | Task | Mover AppConfig (Singleton) para shared/config | Davi | Done | Média |
| MOD-008 | Docs | Documentar comparação MVC vs Modular com tabela de critérios | Davi | Done | Baixa |
| MOD-009 | Docs | Elaborar diagrama de módulos e fluxo arquitetural | Davi | Done | Baixa |
| MOD-010 | Review | Code review da refatoração dos controllers | Pendente | In Review | Alta |

## Pull Request — Descrição

**Título:** Refatoração: migração de MVC para Arquitetura Modular

**Problemas encontrados:**
- Controller continha lógica de negócio de notificação (WhatsApp)
- View acessava repositório diretamente, violando o fluxo MVC
- Repositório único gerenciava dois domínios (pedidos e produtos)
- Ausência de separação por domínio tornava crescimento desordenado
- Sem middleware de interceptação para auth e tratamento de erros

**Decisões arquiteturais:**
- Organização por domínio em vez de por tipo técnico
- `shared/` para código transversal (logger, config, middlewares)
- `NotificacaoService` como responsável exclusivo por comunicação externa
- Middlewares como interceptors HTTP do Angular

**Padrões aplicados:** Service, Repository, Factory (ItemPedidoFactory), Singleton (AppConfig), Middleware (AuthMiddleware, ErrorHandlerMiddleware), Observer (PedidoObserverService), Strategy (DescontoStrategy)

**Melhorias obtidas:** Controllers com responsabilidade única, repositórios com domínio único, estrutura preparada para crescimento, rastreabilidade via Logger centralizado
