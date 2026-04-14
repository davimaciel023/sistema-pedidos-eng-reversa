# Comparação entre Sistema Real e Sistema Didático

---

## Parte 5 – Tabela Comparativa

| Critério               | Sistema Real (Tropykaly)                              | Sistema Didático (sistema-pedidos)                     |
|------------------------|-------------------------------------------------------|--------------------------------------------------------|
| **Arquitetura**        | Monolítica web com PHP, server-side rendering         | Sem arquitetura definida, scripts soltos em JS/HTML    |
| **Coesão**             | Média — há separação de seções, mas provável mistura no código PHP | Baixa — funções de UI, cálculo e dados misturados no mesmo arquivo |
| **Acoplamento**        | Alto — frontend acoplado ao backend PHP, dependência de WhatsApp | Alto — funções de interface diretamente acopladas à lógica de negócio |
| **Organização**        | Melhor organização visual e de navegação por categorias | Organização simples e plana, sem modularização inicial |
| **Flexibilidade**      | Baixa-média — difícil escalar sem refatoração estrutural | Baixa — qualquer mudança exige edição direta nos arquivos |

---

## Principais Diferenças Explicadas

### Arquitetura

O sistema real possui uma arquitetura web completa com backend em PHP respondendo a requisições HTTP, banco de dados para persistência e frontend dinâmico. Já o sistema didático era composto por arquivos JavaScript isolados sem servidor, operando apenas no navegador com dados em memória.

### Coesão

No sistema real, cada página tende a ter um propósito claro (listagem de produtos, carrinho, checkout), o que sugere coesão funcional em nível de interface. No sistema didático, a versão original concentrava toda a lógica — cálculo de preços, manipulação do DOM e controle do pedido — em um único arquivo `script.js`, representando baixíssima coesão.

### Acoplamento

Ambos os sistemas apresentam alto acoplamento, porém de formas diferentes. O sistema real acopla a camada de apresentação diretamente ao PHP, sem uma API intermediária. O sistema didático acoplava as funções de interface diretamente às regras de negócio. Após a refatoração, o sistema didático passou a ter módulos separados (`models.js`, `singleton.js`, `factory.js`, `ui.js`), reduzindo parcialmente o acoplamento.

### Organização

O sistema real apresenta organização de produto mais sofisticada, com categorias, subcategorias, imagens e promoções gerenciadas por um painel administrativo. O sistema didático possui um catálogo fixo e simples definido diretamente no código-fonte.

### Flexibilidade

O sistema real permite adição de produtos via painel administrativo sem alterar o código. O sistema didático requer edição direta do arquivo `factory.js` para adicionar novos produtos ao catálogo, o que é menos flexível do ponto de vista operacional.

---

## Conclusão

O sistema real é mais completo e próximo de uma aplicação de produção, com funcionalidades voltadas ao usuário final e persistência de dados. O sistema didático, por ser simplificado, tornou mais evidentes os problemas de arquitetura e design que a refatoração precisou corrigir. Ambos compartilham desafios de acoplamento e separação de responsabilidades, comuns em projetos que crescem sem planejamento arquitetural inicial.
