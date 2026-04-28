# 🍕 Sistema de Pedidos — Arquitetura em Camadas

## 🧱 Tecnologias utilizadas

- **Angular 17+** — Framework frontend
- **Tailwind CSS** — Estilização
- **JSON Server** — Simulação de backend (API Fake)
- **TypeScript** — Tipagem estática

---

## 📁 Estrutura do projeto
src/app/
models/          → Interfaces: Produto, ItemPedido, Pedido
services/        → PedidoService, ProdutoFactory, DescontoStrategy
repositories/    → PedidoRepositoryService (acesso ao JSON Server)
controllers/     → PedidoControllerService (ponte UI ↔ lógica)
views/           → PedidoComponent (interface do usuário)

---

## ⚙️ Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18+
- [Angular CLI](https://angular.io/cli)
- [JSON Server](https://github.com/typicode/json-server)

---

## 🚀 Como rodar o projeto

### 1. Instale as dependências do Angular

```bash
cd meu-projeto-angular
npm install
```

### 2. Instale o JSON Server globalmente

```bash
npm install -g json-server
```

### 3. Inicie o JSON Server

Abra um terminal na pasta onde está o `db.json` e rode:

```bash
json-server --watch db.json --port 3000
```

Você verá:
Resources
http://localhost:3000/pedidos
http://localhost:3000/produtos

### 4. Inicie o Angular

Abra outro terminal na pasta do projeto Angular e rode:

```bash
ng serve
```

### 5. Acesse no navegador
http://localhost:4200

---

## 🎯 Padrões de projeto aplicados

| Padrão | Onde foi aplicado |
|---|---|
| **Factory** | `ProdutoFactory` — criação de `ItemPedido` |
| **Singleton** | `PedidoService`, `PedidoRepositoryService` via `providedIn: 'root'` |
| **Strategy** | `DescontoStrategy` — `SemDesconto`, `DescontoPercentual`, `DescontoFixo` |
| **Observer** | Angular Signals no `PedidoService` — UI reage automaticamente |
| **Repository** | `PedidoRepositoryService` — isola o acesso aos dados |

---

## 📱 Integração com WhatsApp

Ao finalizar o pedido, o sistema abre automaticamente o WhatsApp com o resumo do pedido enviado para:

- ✅ Telefone do **cliente**
- ✅ Telefone do **estabelecimento**

Os telefones devem ser informados no formato internacional:
5585999999999

---