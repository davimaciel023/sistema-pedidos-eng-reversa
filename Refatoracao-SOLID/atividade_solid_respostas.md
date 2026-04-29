# Atividade: Refatoração com SOLID 

---

**1. Liste quantas responsabilidades diferentes a classe Pedido possui.**

A classe `Pedido` possui **5 responsabilidades**:

- **Pedido** → armazenar dados e calcular total (`calcularTotal`)
- **DescontoService** → aplicar regras de desconto (`aplicarDesconto`)
- **PedidoRepository** → persistência no banco (`salvar`)
- **NotificacaoService** → notificar o cliente (`notificarCliente`)
- **RelatorioExportador** → gerar e exportar relatório (`gerarRelatorio`, `imprimir`)

---

**2. Quantas "razões para mudar" essa classe tem?**

**5 razões:**

1. Mudança na lógica de cálculo de total
2. Mudança nas regras ou tipos de desconto
3. Troca do banco de dados
4. Troca do serviço de notificação
5. Mudança no formato ou destino do relatório

---

**3. Qual seria o nome ideal das novas classes separadas?**

- `Pedido`
- `DescontoService`
- `PedidoRepository`
- `NotificacaoService`
- `RelatorioService`
- `ImpressoraService`
- `PDFExportService`

---

**4. Refatore `aplicarDesconto` usando OCP.**

```ts
interface Desconto {
  aplicar(total: number): number;
}

class DescontoVIP implements Desconto {
  aplicar(total: number) { return total * 0.8; }
}

class DescontoCupom10 implements Desconto {
  aplicar(total: number) { return total * 0.9; }
}

class SemDesconto implements Desconto {
  aplicar(total: number) { return total; }
}

class CalculadoraDesconto {
  constructor(private desconto: Desconto) {}
  calcular(total: number) { return this.desconto.aplicar(total); }
}
```

---

**5. O que acontece se o cliente pedir um desconto de "aniversário de 15%"? Quantas linhas você precisa mudar?**

No código original: é necessário abrir o método `aplicarDesconto` e adicionar um novo `if` — pelo menos **2 linhas alteradas**, com risco de quebrar os casos existentes.

Com OCP: **0 linhas alteradas**. Basta criar uma nova classe `DescontoAniversario`.

---

**6. Como você usaria herança ou composição para resolver isso?**

**Composição**, usando o padrão **Strategy**. Desconto é um comportamento injetável, não uma identidade do pedido. Herança seria inadequada porque não é possível combinar descontos facilmente (ex: VIP + cupom ao mesmo tempo).

---

**7. Se `PedidoDigital` herdar de `Pedido`, o método `calcularFrete()` deveria lançar erro ou retornar 0?**

Nenhuma das duas opções é adequada. Lançar erro quebra o contrato da classe pai. Retornar `0` é semanticamente errado, pois implica que frete existe mas vale zero.

---

**8. Se retornar um erro, isso viola LSP? Por quê?**

**Sim, viola o LSP.** Qualquer código que itere sobre uma lista de `Pedido` e chame `calcularFrete()` vai quebrar ao encontrar um `PedidoDigital`. A subclasse não pode ser substituída pela classe pai sem alterar o comportamento esperado.

---

**9. Como você redesenharia a hierarquia para satisfazer LSP?**

```ts
interface Pedido {
  calcularTotal(): number;
}

interface PedidoComEntrega extends Pedido {
  calcularFrete(): number;
}

class PedidoDigital implements Pedido {
  calcularTotal() { /* ... */ }
}

class PedidoFisico implements PedidoComEntrega {
  calcularTotal() { /* ... */ }
  calcularFrete() { /* ... */ }
}
```

`calcularFrete()` só existe onde faz sentido.

---

**10. Um serviço que só exporta PDF é obrigado a suportar impressora também? Separe as interfaces.**

Não. A interface `imprimir(tipo)` força implementações desnecessárias. A solução é separar em duas interfaces distintas.

---

**11. Crie as interfaces `Imprimivel` e `Exportavel`.**

```ts
interface Imprimivel {
  imprimir(conteudo: string): void;
}

interface Exportavel {
  exportar(conteudo: string): void;
}

class ImpressoraService implements Imprimivel {
  imprimir(conteudo: string) { PrinterService.print(conteudo); }
}

class PDFExportService implements Exportavel {
  exportar(conteudo: string) { PDFService.export(conteudo); }
}
```

---

**12. Refatore `salvar()` e `notificarCliente()` para usar injeção de dependência.**

```ts
interface Database {
  query(sql: string): void;
}

interface Notificador {
  enviar(destinatario: string, mensagem: string): void;
}

class Pedido {
  constructor(
    private db: Database,
    private notificador: Notificador,
    public id: number,
    public cliente: { email: string },
    public itens: { preco: number; quantidade: number }[]
  ) {}

  salvar() {
    this.db.query(`INSERT INTO pedidos VALUES (${this.id})`);
  }

  notificarCliente() {
    this.notificador.enviar(this.cliente.email, `Pedido ${this.id} confirmado!`);
  }
}
```

---

**13. Como você escreveria um teste unitário para `salvar()` sem um banco de dados real?**

```ts
class MockDatabase implements Database {
  public queries: string[] = [];
  query(sql: string) { this.queries.push(sql); }
}

const db = new MockDatabase();
const pedido = new Pedido(db, mockNotificador, 1, { email: 'a@a.com' }, []);
pedido.salvar();

expect(db.queries).toContain('INSERT INTO pedidos VALUES (1)');
```

---

**14. O que muda se trocarmos o `EmailService` por SMS? Quantas classes precisam mudar após a refatoração?**

**Apenas 1 classe** — a implementação concreta do `Notificador`:

```ts
class SMSService implements Notificador {
  enviar(destinatario: string, mensagem: string) {
    SMSGateway.send(destinatario, mensagem);
  }
}
```

A classe `Pedido` e os testes não precisam de nenhuma alteração.
