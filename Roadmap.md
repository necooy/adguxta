# 🛡️ Roadmap — SecureGuard

Documento vivo de progresso do projeto.

---

## Fase 1: Infraestrutura e Configuração
- [x] Inicializar `package.json` com dependências
- [x] Criar `.env.example` e `.gitignore`
- [x] Configurar `vercel.json` para deploy serverless
- [x] Criar estrutura de diretórios

## Fase 2: Backend / API
- [x] Conexão MongoDB com cache para serverless (`api/config/db.js`)
- [x] Modelo Mongoose `Item` (`api/models/Item.js`)
- [x] Middleware de validação de entrada (`api/middlewares/validator.js`)
- [x] Middleware de tratamento de erros (`api/middlewares/errorHandler.js`)
- [x] Controller CRUD (`api/controllers/itemController.js`)
- [x] Rotas REST (`api/routes/itemRoutes.js`)
- [x] App Express (`api/app.js`)
- [x] Entrypoint Vercel (`api/index.js`)
- [x] Entrypoint local (`server.js`)

## Fase 3: Testes Automatizados
- [x] Testes POST (criação válida e inválida)
- [x] Testes GET (listagem e consulta por ID)
- [x] Testes PUT (atualização)
- [x] Testes DELETE (exclusão)

## Fase 4: Frontend
- [x] HTML5 semântico (`frontend/index.html`)
- [x] CSS3 responsivo com design moderno (`frontend/style.css`)
- [x] JavaScript Vanilla com CRUD via fetch (`frontend/script.js`)
- [x] Grid de cards com imagem, marca, modelo e preço
- [x] Modal de formulário com preview de imagem
- [x] Modal de confirmação de exclusão
- [x] Estados: loading, empty, error
- [x] Toasts de notificação

## Fase 5: Documentação
- [x] `Roadmap.md` (este arquivo)
- [x] `Contexto.md`
- [x] `api.md`
- [x] `README.md`

## Fase 6: Deploy e Validação Final
- [ ] Configurar variável `MONGODB_URI` na Vercel
- [ ] Deploy na Vercel
- [ ] Testar ciclo completo em produção
