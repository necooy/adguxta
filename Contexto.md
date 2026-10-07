# 📋 Contexto Técnico — SecureGuard

Documento vivo de decisões arquiteturais e contexto do projeto.

---

## Visão Geral

**SecureGuard** é um mini sistema web para gerenciamento (CRUD) de itens e aparelhos de segurança. Permite cadastrar, listar, editar e excluir equipamentos com marca, modelo, preço e foto.

## Stack Tecnológica

| Camada     | Tecnologia                    | Justificativa                                      |
|------------|-------------------------------|-----------------------------------------------------|
| Backend    | Node.js + Express.js          | Leve, performático, ampla comunidade                |
| Banco      | MongoDB + Mongoose            | Flexibilidade de schema, boa integração com Node.js |
| Frontend   | HTML5 + CSS3 + JS Vanilla     | Sem dependências pesadas, rápido e portátil         |
| Testes     | Jest + Supertest + MemoryServer | Testes isolados sem banco externo                 |
| Deploy     | Vercel (Serverless)           | Deploy zero-config, escalabilidade automática       |

## Decisões Arquiteturais

### 1. Cache de Conexão MongoDB
Em ambiente serverless (Vercel), cada invocação pode criar uma nova conexão. Implementamos um padrão singleton que reutiliza a conexão existente via variável global, evitando esgotamento de sockets.

### 2. Validação em Duas Camadas
- **Middleware `validator.js`**: Validação e sanitização antes de chegar ao controller.
- **Schema Mongoose**: Validação final na camada de persistência como safety net.

### 3. Tratamento Centralizado de Erros
O middleware `errorHandler.js` intercepta todos os erros não tratados e retorna respostas JSON padronizadas. Em produção, stack traces são ocultados.

### 4. Frontend Desacoplado
O frontend é totalmente estático e se comunica via `fetch()` com a API REST. Isso permite:
- Deploy independente
- Cache agressivo de assets
- Manutenção separada

### 5. Responsividade Mobile-First
CSS com breakpoints em 480px, 768px e 1024px. Grid adaptativo com `auto-fill` e `minmax`.

## Estrutura do Projeto

```
/
├── api/           → Backend REST (Express + Mongoose)
├── frontend/      → Interface estática (HTML/CSS/JS)
├── tests/         → Testes automatizados (Jest)
├── server.js      → Entrypoint local
├── vercel.json    → Configuração de deploy
└── package.json   → Dependências
```

## Modelo de Dados

| Campo       | Tipo     | Obrigatório | Validação                         |
|-------------|----------|:-----------:|-----------------------------------|
| `marca`     | String   | ✅           | Não vazio, trim                   |
| `modelo`    | String   | ✅           | Não vazio, trim                   |
| `preco`     | Number   | ✅           | ≥ 0                              |
| `foto`      | String   | ❌           | URL http/https válida (se preenchida) |
| `createdAt` | Date     | Auto        | Timestamp automático              |
| `updatedAt` | Date     | Auto        | Timestamp automático              |

## Padrão de Resposta de Erro

```json
{
  "error": "Tipo do erro",
  "message": "Descrição amigável do problema."
}
```

## Histórico de Decisões

| Data       | Decisão                                    | Motivo                                    |
|------------|--------------------------------------------|--------------------------------------------|
| 2026-10-07 | Escolha de MongoDB sobre SQLite            | Melhor integração com Vercel serverless    |
| 2026-10-07 | Vanilla JS no frontend (sem React/Vue)     | Requisito de simplicidade e portabilidade  |
| 2026-10-07 | `mongodb-memory-server` para testes        | Isolamento total, sem dependência externa  |
| 2026-10-07 | Paleta escura azul-ardósia                 | Tema tecnológico premium para segurança    |
