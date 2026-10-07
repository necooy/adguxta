# 🛡️ SecureGuard — Sistema de Itens de Segurança

Mini sistema web para gerenciamento (CRUD) de itens e aparelhos de segurança, com backend RESTful e frontend moderno.

---

## ⚡ Início Rápido

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) (ou instância local)

### 1. Clonar e Instalar

```bash
git clone <url-do-repo>
cd prompt-antigravity
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` com sua string de conexão MongoDB:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/seguranca_db
PORT=3000
NODE_ENV=development
```

### 3. Executar Localmente

```bash
npm start
```

Acesse:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/items
- **Health:** http://localhost:3000/api/health

---

## 🧪 Testes

Testes automatizados com banco MongoDB em memória (não requer conexão externa):

```bash
npm test
```

Os testes cobrem:
- Criação com dados válidos e inválidos
- Listagem vazia e populada
- Consulta por ID (válido, inválido, inexistente)
- Atualização com sucesso e falhas
- Exclusão com sucesso e falhas

---

## 🚀 Deploy na Vercel

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Configurar Variável de Ambiente

No painel da Vercel, adicione:
- **Nome:** `MONGODB_URI`
- **Valor:** sua string de conexão MongoDB Atlas

### 4. Redeploy

```bash
vercel --prod
```

---

## 📁 Estrutura do Projeto

```
├── api/
│   ├── config/db.js            # Conexão MongoDB (cache serverless)
│   ├── controllers/itemController.js  # Lógica CRUD
│   ├── middlewares/
│   │   ├── errorHandler.js     # Tratamento de erros
│   │   └── validator.js        # Validação de entrada
│   ├── models/Item.js          # Schema Mongoose
│   ├── routes/itemRoutes.js    # Rotas REST
│   ├── app.js                  # Express config
│   └── index.js                # Entrypoint Vercel
├── frontend/
│   ├── index.html              # Interface
│   ├── style.css               # Estilos
│   └── script.js               # Lógica frontend
├── tests/
│   └── items.test.js           # Testes automatizados
├── server.js                   # Servidor local
├── vercel.json                 # Config Vercel
├── Roadmap.md                  # Progresso do projeto
├── Contexto.md                 # Decisões técnicas
└── api.md                      # Documentação da API
```

---

## 📡 API Endpoints

| Método   | Rota              | Descrição              |
|----------|-------------------|------------------------|
| `GET`    | `/api/items`      | Listar todos os itens  |
| `GET`    | `/api/items/:id`  | Consultar item por ID  |
| `POST`   | `/api/items`      | Criar novo item        |
| `PUT`    | `/api/items/:id`  | Atualizar item         |
| `DELETE` | `/api/items/:id`  | Excluir item           |
| `GET`    | `/api/health`     | Health check           |

Documentação completa em [`api.md`](api.md).

---

## 🎨 Interface

- **Design:** Tema escuro premium com paleta azul-ardósia
- **Responsiva:** Mobile (375px), Tablet (768px), Desktop (1200px+)
- **Interativa:** Micro-animações, toasts, modais, preview de imagem
- **Acessível:** Labels, ARIA, navegação por teclado (ESC fecha modais)

---

## 📄 Licença

Este projeto é de uso acadêmico/educacional.