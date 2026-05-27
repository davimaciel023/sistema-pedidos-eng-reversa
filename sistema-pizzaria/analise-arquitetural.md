# Análise Arquitetural — Refatoração para MVC

## Parte 7 – Análise Arquitetural

**1. O MVC melhorou a organização?**
Sim. A separação em Models, Views, Controllers, Services e Repositories tornou cada arquivo responsável por um único papel. Antes, lógica de negócio, acesso a dados e renderização coexistiam nos mesmos componentes Angular sem fronteiras claras.

**2. O sistema ficou mais desacoplado?**
Sim. A View (PedidoComponent) não chama mais o Service diretamente para lógica de negócio — ela delega ao Controller. O Repository é a única camada que conhece a URL da API. O AppConfig Singleton centraliza a configuração, evitando strings espalhadas pelo código.

**3. Onde ainda existem problemas?**
- A View ainda injeta `PedidoRepositoryService` para carregar produtos; o ideal seria um `ProdutoController` separado.
- O `window.open` no Controller ainda é uma dependência implícita do browser — poderia ser abstraída em um `WhatsAppService`.
- Angular Signals e o Observer pattern (RxJS Subject) coexistem, gerando dois mecanismos para o mesmo propósito.

**4. O MVC seria suficiente para um sistema muito grande?**
Não. Em sistemas grandes, o MVC tende a gerar Controllers e Services "gordos" com muitas responsabilidades. Arquiteturas como Clean Architecture, CQRS ou Feature Modules do próprio Angular oferecem melhor escalabilidade e testabilidade.

**5. Quais limitações você percebeu?**
- Controllers tendem a crescer ao receber cada novo caso de uso.
- A fronteira entre Controller e Service é subjetiva e pode ser violada facilmente.
- A camada de View em SPA (Angular) já tem seu próprio sistema de gerenciamento de estado (Signals/RxJS), o que torna o MVC tradicional redundante em alguns pontos.
- Difícil separar completamente a lógica de UI da lógica de negócio em frameworks reativos.

**6. Onde services ajudaram?**
- `PedidoService`: centralizou toda a lógica de manipulação do carrinho (adicionar, remover, recalcular total).
- `DescontoService`: isolou o padrão Strategy de desconto, permitindo trocar a estratégia sem afetar o restante.
- `PedidoObserverService`: desacoplou a notificação de mudanças de estado da lógica de negócio.

**7. Onde repositories ajudaram?**
- `PedidoRepositoryService`: isolou toda a comunicação HTTP com o JSON Server. Se a API mudar (ex.: migrar para GraphQL), só este arquivo precisa ser alterado.

---

## Parte 8 – Problemas do MVC Tradicional em Sistemas Grandes

| Problema | Descrição |
|---|---|
| **Controllers gordos** | Com mais casos de uso, o PedidoController acumularia dezenas de métodos, tornando-se difícil de manter. |
| **Excesso de responsabilidades** | Um único Service pode acabar gerenciando autenticação, validação, cálculos e integração — violando o SRP. |
| **Dificuldade de manutenção** | Sem módulos independentes, uma mudança em uma funcionalidade pode quebrar outra indiretamente. |
| **Dificuldade de navegação** | Com centenas de arquivos em pastas genéricas (models/, controllers/), encontrar o arquivo certo fica difícil. |
| **Aumento do acoplamento** | Controllers dependem de múltiplos Services; Services dependem de múltiplos Repositories — a cadeia de dependências cresce. |
| **Dificuldade de escalabilidade** | Não há separação por domínio (ex.: módulo de pedidos, módulo de clientes). Tudo convive no mesmo namespace. |

---

## Parte 9 – Comparação Arquitetural

| Critério | Sistema Original | MVC Refatorado |
|---|---|---|
| Organização | Baixa — código misturado em poucos arquivos | Alta — cada responsabilidade tem seu lugar |
| Coesão | Baixa — funções faziam várias coisas | Alta — cada classe tem uma função clara |
| Acoplamento | Alto — componentes dependiam uns dos outros diretamente | Médio — dependências mediadas por injeção e Observer |
| Reutilização | Baixa — lógica presa à UI | Alta — Services e Repositories podem ser reutilizados |
| Clareza estrutural | Baixa | Alta — estrutura autodocumentada pelas pastas |
| Escalabilidade | Baixa | Média — boa para sistemas médios, limitada para grandes |
| Facilidade de manutenção | Baixa | Alta — alterações ficam contidas na camada certa |

---

## Parte 10 – Modelagem

### Diagrama de Classes (textual)

```
┌─────────────────┐       ┌──────────────────────┐
│  PedidoComponent│──────▶│ PedidoControllerService│
│  (View)         │       └──────────┬───────────┘
└─────────────────┘                  │
         │                           ▼
         │ observa            ┌──────────────┐
         ▼                    │ PedidoService│
┌──────────────────────┐      └──────┬───────┘
│ PedidoObserverService│◀────────────┤
│ (Observer/Subject)   │             │
└──────────────────────┘    ┌────────┴────────┐
                             │                │
                             ▼                ▼
                    ┌──────────────┐  ┌─────────────────┐
                    │DescontoService│  │PedidoRepository  │
                    │ (Strategy)    │  │Service           │
                    └──────────────┘  └────────┬─────────┘
                                               │
                    ┌──────────────┐            ▼
                    │  AppConfig   │◀─── JSON Server (HTTP)
                    │ (Singleton)  │
                    └──────────────┘

Models: Produto, Pedido, ItemPedido
Factory: ProdutoFactory (cria ItemPedido a partir de Produto + quantidade)
```

### Fluxo MVC

```
View (PedidoComponent)
  │ evento (click "adicionar produto")
  ▼
Controller (PedidoControllerService)
  │ chama service.adicionarItem()
  ▼
Service (PedidoService)
  │ aplica regra de negócio (ProdutoFactory, DescontoService)
  │ notifica PedidoObserverService
  ▼
Repository (PedidoRepositoryService)
  │ persiste via HTTP POST
  ▼
Model (Pedido, ItemPedido, Produto) — estrutura de dados
  │
  ▼
Observer notifica View → View re-renderiza com novo estado
```
