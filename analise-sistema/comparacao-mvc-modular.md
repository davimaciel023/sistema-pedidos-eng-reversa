# Parte 8 — Comparação Arquitetural: MVC vs Modular

## Tabela Comparativa

| Critério | MVC (anterior) | Modular (atual) |
|---|---|---|
| **Organização** | Por tipo de camada (`services/`, `models/`, `controllers/`) — todos os domínios misturados | Por domínio (`orders/`, `products/`, `payments/`, `auth/`) — cada módulo autocontido |
| **Escalabilidade** | Baixa — adicionar novos domínios polui as pastas existentes | Alta — cada novo domínio ganha sua própria pasta sem impactar os demais |
| **Acoplamento** | Alto — view acessava repositório diretamente; controller continha lógica de notificação | Baixo — cada camada depende apenas da camada imediatamente abaixo dentro do próprio módulo |
| **Reutilização** | Baixa — `DescontoService` e `ProdutoFactory` misturados com serviços de pedido | Alta — `shared/` centraliza utilitários (Logger, AppConfig, Middlewares) usados por qualquer módulo |
| **Facilidade de manutenção** | Difícil — para manter pedidos era necessário navegar por `services/`, `models/`, `controllers/`, `repositories/` de forma separada | Fácil — toda lógica de pedidos está em `modules/orders/` |
| **Separação de responsabilidades** | Parcial — controller tinha lógica de WhatsApp; view acessava repositório | Completa — controller só orquestra; service contém regras; repository acessa dados; notificação em serviço próprio |
| **Facilidade de navegação** | Baixa — 6 arquivos na pasta `services/` com domínios diferentes | Alta — para encontrar qualquer coisa de pedidos, entra-se em `modules/orders/` |

---

## Justificativa Arquitetural

### Por que migrar do MVC para Modular?

O MVC organiza o código por **tipo técnico** (models, views, controllers). Isso funciona bem quando o sistema tem um único domínio. À medida que o sistema cresce, cada pasta acumula arquivos de domínios diferentes, tornando difícil responder: "onde fica tudo relacionado a pedidos?"

A arquitetura modular organiza por **domínio de negócio**. A pergunta "onde fica tudo de pedidos?" tem resposta imediata: `modules/orders/`. Isso reduz o tempo de navegação, facilita onboarding de novos desenvolvedores e permite que times diferentes trabalhem em módulos diferentes com mínimo conflito.

### Dificuldades da Migração

1. **Atualização de imports** — todos os arquivos que dependiam de `../../services/pedido` precisam apontar para `../../modules/orders/services/pedido.service`
2. **Divisão do repositório único** — `PedidoRepositoryService` respondia por pedidos e produtos; foi necessário criar `PedidoRepository` e `ProdutoRepository` separados
3. **Extração da lógica de notificação** — `enviarWhatsApp` estava no controller; foi extraído para `NotificacaoService` dentro de `orders/services/`
4. **Criação do módulo `shared/`** — AppConfig (Singleton) e Logger precisavam de um lugar neutro, pois são usados por todos os módulos

### Melhorias Obtidas

- Controllers com responsabilidade única (apenas orquestrar)
- Repositórios com domínio único (pedidos ou produtos, não ambos)
- `NotificacaoService` testável e reutilizável independentemente do controller
- `LoggerService` centralizado em `shared/utils/` disponível para todos os módulos
- Middlewares de autenticação e tratamento de erros aplicados globalmente via `shared/middlewares/`
- Estrutura preparada para crescimento: adicionar `reviews/`, `delivery/`, `usuarios/` significa criar uma nova pasta em `modules/` sem tocar nos demais
