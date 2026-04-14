# Problemas Identificados e Melhorias Propostas

---

## Parte 7 – Problemas Identificados

### 1. Limitações de Arquitetura

- **Monolito sem separação clara:** A provável mistura de lógica PHP com HTML nas mesmas páginas dificulta manutenção e escalabilidade
- **Ausência de API REST:** Sem uma API, o frontend não pode ser desacoplado, impossibilitando a criação de um aplicativo mobile nativo no futuro sem reescrever o backend
- **Dependência de WhatsApp para finalização:** Redirecionar o pedido via link do WhatsApp é frágil — qualquer mudança no número ou formato quebra o fluxo de checkout
- **Sem versionamento visível da API:** Impossível evoluir funcionalidades sem impactar clientes existentes

### 2. Alto Acoplamento

- A camada de apresentação está diretamente acoplada à lógica de backend em PHP
- O sistema de carrinho provavelmente depende de sessão PHP no servidor, acoplando o estado do usuário ao servidor (problema em ambientes com múltiplos servidores)
- Imagens armazenadas no próprio servidor criam dependência entre o sistema de arquivos e a aplicação

### 3. Dificuldade de Manutenção

- Sem uso aparente de framework MVC, alterações em regras de negócio podem exigir edição em múltiplos arquivos PHP
- A ausência de testes automatizados (inferida) torna qualquer mudança arriscada
- O painel administrativo integrado ao mesmo servidor cria risco de segurança (superfície de ataque maior)
- Atualizações de cardápio dependem de acesso ao painel, sem API para integração com sistemas externos (ex: sistema de caixa)

---

## Parte 9 – Aplicação de Padrões de Projeto

### Factory

**Como aplicar:**

Criar uma classe `ProdutoFactory` que recebe os dados brutos do banco de dados e instancia objetos `Produto` corretamente tipados. Isso centraliza a lógica de criação e evita duplicação:

```php
class ProdutoFactory {
    public static function criar(array $dados): Produto {
        return match($dados['categoria']) {
            'pizza'   => new Pizza($dados),
            'lanche'  => new Lanche($dados),
            'bebida'  => new Bebida($dados),
            default   => new Produto($dados),
        };
    }
}
```

**Benefício:** Adicionar um novo tipo de produto exige apenas criar uma nova classe, sem alterar o restante do sistema.

---

### Singleton

**Como aplicar:**

Garantir que a conexão com o banco de dados seja única durante toda a requisição, evitando múltiplas conexões desnecessárias:

```php
class Conexao {
    private static ?PDO $instancia = null;

    private function __construct() {}

    public static function getInstance(): PDO {
        if (self::$instancia === null) {
            self::$instancia = new PDO(
                'mysql:host=localhost;dbname=tropykaly',
                'usuario',
                'senha'
            );
        }
        return self::$instancia;
    }
}
```

**Benefício:** Reduz consumo de recursos e garante consistência no acesso ao banco durante toda a requisição.

---

## Melhorias Gerais Propostas

| Problema                        | Melhoria Proposta                                              |
|---------------------------------|----------------------------------------------------------------|
| Monolito acoplado               | Migrar para arquitetura MVC com framework (ex: Laravel)       |
| Ausência de API                 | Criar API REST para produtos, pedidos e categorias            |
| Checkout via WhatsApp           | Implementar fluxo de checkout nativo com geração de pedido no banco |
| Estado da sessão no servidor    | Adotar tokens JWT para autenticação stateless                 |
| Imagens no servidor             | Migrar para serviço de armazenamento em nuvem (ex: S3, Cloudinary) |
| Sem testes                      | Implementar testes unitários para regras de negócio           |
| Painel admin no mesmo servidor  | Separar o painel administrativo em subdomínio com autenticação própria |
