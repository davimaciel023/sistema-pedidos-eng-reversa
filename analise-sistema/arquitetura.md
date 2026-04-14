# Proposta de Arquitetura — Sistema Real (Tropykaly)

---

## Parte 8 – Proposta de Arquitetura

### Arquitetura Atual (inferida)

O sistema atual opera como um monolito PHP tradicional: o servidor processa as requisições, consulta o banco de dados e devolve páginas HTML completas ao navegador. Não há separação clara entre frontend e backend como serviços independentes.

---

### Proposta: Arquitetura em Camadas com MVC

Recomenda-se reorganizar o sistema em três camadas bem definidas, seguindo o padrão **MVC (Model-View-Controller)**:

```
┌──────────────────────────────────────────┐
│              CAMADA DE VISÃO             │
│  HTML + CSS + JavaScript (SPA ou SSR)    │
│  Responsável apenas por exibir dados     │
└─────────────────┬────────────────────────┘
                  │ requisições HTTP / API REST
┌─────────────────▼────────────────────────┐
│           CAMADA DE CONTROLE             │
│  Controllers PHP (ex: PedidoController)  │
│  Recebe requisições, chama serviços      │
└─────────────────┬────────────────────────┘
                  │
┌─────────────────▼────────────────────────┐
│            CAMADA DE MODELO              │
│  Classes de domínio + acesso ao banco    │
│  Produto, Pedido, Categoria, ItemPedido  │
└──────────────────────────────────────────┘
```

---

### Separação de Responsabilidades

| Componente          | Responsabilidade                                               |
|---------------------|----------------------------------------------------------------|
| `ProdutoController` | Listar produtos por categoria, buscar por ID                  |
| `PedidoController`  | Criar pedido, adicionar/remover itens, calcular total         |
| `CategoriaController` | Listar e filtrar categorias                                 |
| `Produto` (Model)   | Atributos: nome, preço, descrição, imagem, categoria         |
| `Pedido` (Model)    | Itens, total, status, data                                    |
| `ItemPedido` (Model)| Produto, quantidade, subtotal                                 |
| `View`              | Templates HTML que exibem os dados recebidos do Controller    |

---

### Componentes Principais Propostos

1. **Frontend (View)**
   - Página de cardápio com filtro por categoria
   - Componente de carrinho persistente
   - Página de checkout com resumo do pedido

2. **Backend (Controller + Model)**
   - API REST para produtos: `GET /produtos`, `GET /produtos/{categoria}`
   - API REST para pedidos: `POST /pedidos`, `PUT /pedidos/{id}/itens`
   - Autenticação para o painel administrativo

3. **Banco de Dados**
   - Tabelas: `produtos`, `categorias`, `pedidos`, `itens_pedido`, `usuarios`

4. **Serviços Externos**
   - Integração com WhatsApp API (em vez de link direto)
   - Gateway de pagamento (evolução futura)

---

## Parte 4 – Padrões de Projeto

### O sistema aparenta utilizar padrões?

Com base na análise externa, não é possível confirmar o uso formal de padrões de projeto. Porém, a existência de um painel administrativo e de categorias dinâmicas sugere algum nível de abstração no backend.

### Onde poderiam existir Factory, Singleton e MVC?

| Padrão      | Onde poderia existir / ser aplicado                                      |
|-------------|--------------------------------------------------------------------------|
| **Factory** | Criação de objetos `Produto` a partir dos dados do banco de dados; criação de diferentes tipos de pedido (delivery, balcão) |
| **Singleton** | Conexão com o banco de dados (garantir uma única instância de PDO/mysqli); gerenciamento do carrinho de compras na sessão |
| **MVC**     | Estrutura geral do backend: Controllers para roteamento, Models para entidades, Views para templates HTML |

### Onde poderiam ser aplicados?

- **Factory:** na classe responsável por instanciar produtos a partir do resultado de queries SQL, evitando duplicação de código de criação
- **Singleton:** na classe de conexão com o banco de dados, garantindo que apenas uma conexão seja aberta por requisição
- **MVC:** como padrão arquitetural global, separando completamente a lógica de negócio da apresentação
