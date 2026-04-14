# Análise do Sistema Real — Tropykaly Pizzas e Lanches

**URL:** https://tropykalypizzaselanches.com.br/

---

## Parte 1 – Análise do Sistema Real

### 1. Qual é o objetivo do sistema?

O sistema tem como objetivo oferecer uma plataforma de pedidos online para uma pizzaria e lanchonete. Ele permite que clientes visualizem o cardápio digital, escolham produtos, montem seu pedido e finalizem a compra de forma digital, sem necessidade de ligar ou ir ao estabelecimento.

### 2. Quais funcionalidades ele oferece?

- Catálogo de produtos com imagens, nomes e preços
- Organização por categorias (Pizzas, Lanches, Bebidas, Acompanhamentos)
- Seção de combos e promoções
- Carrinho de compras com cálculo de subtotal em tempo real
- Banners rotativos para destaque de ofertas
- Integração com WhatsApp para contato/suporte
- Links para redes sociais (Instagram)
- Sistema responsivo (funciona em mobile e desktop)

### 3. Como o usuário interage com o sistema?

O fluxo de interação do usuário segue as seguintes etapas:

1. Acessa o site e visualiza banners promocionais na página inicial
2. Navega pelas abas de categorias (Pizzas, Lanches, Bebidas, etc.)
3. Seleciona um produto de interesse
4. Adiciona o produto ao carrinho
5. Visualiza o subtotal atualizado automaticamente
6. Acessa o carrinho completo para revisar o pedido
7. Finaliza o pedido (via formulário ou redirecionamento para WhatsApp)

### 4. Como os produtos estão organizados?

Os produtos estão organizados em categorias hierárquicas:

| Categoria       | Exemplos / Subcategorias                              |
|-----------------|-------------------------------------------------------|
| Pizzas          | Tamanhos: pequena, média, grande e gigante            |
| Lanches         | Hambúrgueres artesanais bovinos (Classic, King, Supremo) em pão brioche |
| Bebidas         | Sucos, vitaminas, refrigerantes                       |
| Acompanhamentos | Porções variadas                                      |
| Combos          | Combinações promocionais de produtos                  |
| Promoções       | Ofertas especiais por tempo limitado                  |

---

## Parte 2 – Análise de Arquitetura

### Tipo de arquitetura

O sistema aparenta utilizar uma **arquitetura monolítica web tradicional**, baseada em servidor com renderização de páginas no backend (server-side rendering). A presença de extensões `.php` nas URLs indica que o backend é desenvolvido em PHP.

### Possível divisão em camadas

Inferindo pelo comportamento externo:

| Camada         | Responsabilidade inferida                                      |
|----------------|----------------------------------------------------------------|
| Apresentação   | HTML/CSS renderizado pelo servidor, JavaScript para interações dinâmicas |
| Negócio        | Lógica de cálculo de preços, montagem de pedidos, aplicação de promoções |
| Dados          | Banco de dados relacional (provavelmente MySQL) para produtos, pedidos e categorias |

### Existência de separação de responsabilidades

A separação de responsabilidades **existe parcialmente**. O frontend lida com apresentação e o backend com processamento, porém em sistemas PHP monolíticos tradicionais é comum que lógica de negócio e apresentação estejam misturadas nos mesmos arquivos `.php`, reduzindo a separação real. Não há evidências externas de uso de frameworks MVC como Laravel ou Symfony.

**Justificativa:** A navegação por categorias é dinâmica e os dados de produto mudam sem recarregar a página por completo em alguns pontos, sugerindo uso de AJAX ou JavaScript assíncrono, mas a estrutura geral ainda é monolítica.

---

## Parte 3 – Análise de Design

### Coesão

- **Positivo:** Cada página/seção parece ter um objetivo claro (catálogo, carrinho, promoções)
- **Negativo:** Em sistemas PHP sem framework, é comum que um único arquivo concentre responsabilidades de banco de dados, lógica e exibição — o que reduz a coesão

### Acoplamento

- **Alto acoplamento provável** entre as camadas de apresentação e dados, dado o padrão PHP tradicional
- A dependência direta do WhatsApp para finalização do pedido cria acoplamento externo com serviço de terceiros
- Imagens dinâmicas e painel administrativo integrado sugerem acoplamento forte entre frontend e backend

### Separação de responsabilidades

- O cardápio, o carrinho e o checkout aparecem como seções distintas — o que sugere algum nível de separação visual
- Porém, sem acesso ao código, não é possível afirmar que essa separação existe no nível do código-fonte
- A ausência de uma API pública visível indica que não há separação entre frontend e backend no modelo cliente-servidor desacoplado
