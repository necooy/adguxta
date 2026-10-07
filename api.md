# 📡 Documentação da API — SecureGuard

Base URL: `http://localhost:3000/api` (local) ou `https://seu-dominio.vercel.app/api` (produção)

---

## Endpoints

### 1. Listar Todos os Itens

```
GET /api/items
```

**Resposta (200 OK):**
```json
[
  {
    "_id": "6543abc...",
    "marca": "Intelbras",
    "modelo": "VHL 1220 D",
    "preco": 349.9,
    "foto": "https://example.com/camera.jpg",
    "createdAt": "2026-10-07T14:00:00.000Z",
    "updatedAt": "2026-10-07T14:00:00.000Z"
  }
]
```

**Exemplo curl:**
```bash
curl -s http://localhost:3000/api/items | json_pp
```

---

### 2. Consultar Item por ID

```
GET /api/items/:id
```

**Respostas:**
- `200 OK` — Item encontrado
- `400 Bad Request` — ID com formato inválido
- `404 Not Found` — Item não encontrado

**Exemplo curl:**
```bash
curl -s http://localhost:3000/api/items/6543abc123def456 | json_pp
```

---

### 3. Criar Novo Item

```
POST /api/items
Content-Type: application/json
```

**Body:**
```json
{
  "marca": "Intelbras",
  "modelo": "VHL 1220 D",
  "preco": 349.90,
  "foto": "https://example.com/camera.jpg"
}
```

| Campo    | Tipo   | Obrigatório | Descrição                      |
|----------|--------|:-----------:|--------------------------------|
| `marca`  | string | ✅           | Nome da marca do equipamento   |
| `modelo` | string | ✅           | Nome do modelo                 |
| `preco`  | number | ✅           | Preço em reais (≥ 0)           |
| `foto`   | string | ❌           | URL http/https da imagem       |

**Respostas:**
- `201 Created` — Item criado com sucesso
- `400 Bad Request` — Dados inválidos

**Exemplo curl:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Intelbras",
    "modelo": "VHL 1220 D",
    "preco": 349.90,
    "foto": "https://example.com/camera.jpg"
  }'
```

---

### 4. Atualizar Item

```
PUT /api/items/:id
Content-Type: application/json
```

**Body:** Campos que deseja atualizar (mesma estrutura do POST).

**Respostas:**
- `200 OK` — Item atualizado
- `400 Bad Request` — Dados inválidos ou ID inválido
- `404 Not Found` — Item não encontrado

**Exemplo curl:**
```bash
curl -X PUT http://localhost:3000/api/items/6543abc123def456 \
  -H "Content-Type: application/json" \
  -d '{"preco": 299.90}'
```

---

### 5. Excluir Item

```
DELETE /api/items/:id
```

**Respostas:**
- `200 OK` — Item removido com sucesso
- `404 Not Found` — Item não encontrado

**Exemplo curl:**
```bash
curl -X DELETE http://localhost:3000/api/items/6543abc123def456
```

---

### 6. Health Check

```
GET /api/health
```

**Resposta (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-10-07T14:00:00.000Z"
}
```

---

## Formato de Erro Padrão

Todas as respostas de erro seguem o formato:

```json
{
  "error": "Tipo do erro",
  "message": "Descrição legível do problema."
}
```

### Códigos de Status Utilizados

| Código | Significado             |
|--------|--------------------------|
| 200    | Operação bem-sucedida   |
| 201    | Recurso criado          |
| 400    | Dados inválidos         |
| 404    | Recurso não encontrado  |
| 500    | Erro interno do servidor |
