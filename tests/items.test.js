const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../api/app');
const Item = require('../api/models/Item');

let mongoServer;

// Configurar banco em memória antes dos testes
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Limpar coleção entre testes
afterEach(async () => {
  await Item.deleteMany({});
});

// Desconectar e parar o servidor ao final
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ============================================================
// POST /api/items - Criação de itens
// ============================================================
describe('POST /api/items', () => {
  it('deve criar um item com dados válidos (201)', async () => {
    const payload = {
      marca: 'Intelbras',
      modelo: 'VHL 1220 D',
      preco: 349.9,
      foto: 'https://example.com/camera.jpg',
    };

    const res = await request(app).post('/api/items').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.marca).toBe('Intelbras');
    expect(res.body.modelo).toBe('VHL 1220 D');
    expect(res.body.preco).toBe(349.9);
    expect(res.body.foto).toBe('https://example.com/camera.jpg');
  });

  it('deve criar item sem foto (foto opcional) (201)', async () => {
    const payload = { marca: 'Hikvision', modelo: 'DS-2CE', preco: 500 };
    const res = await request(app).post('/api/items').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.foto).toBe('');
  });

  it('deve falhar ao criar item sem marca (400)', async () => {
    const payload = { modelo: 'XYZ', preco: 100 };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve falhar ao criar item sem modelo (400)', async () => {
    const payload = { marca: 'Samsung', preco: 200 };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve falhar ao criar item sem preço (400)', async () => {
    const payload = { marca: 'Samsung', modelo: 'Galaxy Cam' };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve falhar ao criar item com preço negativo (400)', async () => {
    const payload = { marca: 'Samsung', modelo: 'Galaxy', preco: -10 };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(400);
  });

  it('deve falhar ao criar item com preço não numérico (400)', async () => {
    const payload = { marca: 'Samsung', modelo: 'Galaxy', preco: 'abc' };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(400);
  });

  it('deve falhar ao criar item com URL de foto inválida (400)', async () => {
    const payload = {
      marca: 'Samsung',
      modelo: 'Galaxy',
      preco: 100,
      foto: 'not-a-url',
    };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(400);
  });
});

// ============================================================
// GET /api/items - Listagem de itens
// ============================================================
describe('GET /api/items', () => {
  it('deve retornar lista vazia quando não há itens (200)', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('deve retornar lista populada após inserção (200)', async () => {
    await Item.create({ marca: 'A', modelo: 'B', preco: 10 });
    await Item.create({ marca: 'C', modelo: 'D', preco: 20 });

    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// ============================================================
// GET /api/items/:id - Consulta por ID
// ============================================================
describe('GET /api/items/:id', () => {
  it('deve retornar item existente por ID (200)', async () => {
    const item = await Item.create({ marca: 'Test', modelo: 'Model', preco: 50 });
    const res = await request(app).get(`/api/items/${item._id}`);

    expect(res.status).toBe(200);
    expect(res.body.marca).toBe('Test');
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/items/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('deve retornar 400 para ID com formato inválido', async () => {
    const res = await request(app).get('/api/items/id-invalido');
    expect(res.status).toBe(400);
  });
});

// ============================================================
// PUT /api/items/:id - Atualização de itens
// ============================================================
describe('PUT /api/items/:id', () => {
  it('deve atualizar item existente com dados válidos (200)', async () => {
    const item = await Item.create({ marca: 'Old', modelo: 'Model', preco: 100 });

    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .send({ marca: 'New', preco: 200 });

    expect(res.status).toBe(200);
    expect(res.body.marca).toBe('New');
    expect(res.body.preco).toBe(200);
  });

  it('deve retornar 404 ao atualizar ID inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/items/${fakeId}`)
      .send({ marca: 'X' });
    expect(res.status).toBe(404);
  });

  it('deve retornar 400 ao atualizar com dados inválidos', async () => {
    const item = await Item.create({ marca: 'A', modelo: 'B', preco: 10 });
    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .send({ preco: -5 });
    expect(res.status).toBe(400);
  });
});

// ============================================================
// DELETE /api/items/:id - Exclusão de itens
// ============================================================
describe('DELETE /api/items/:id', () => {
  it('deve excluir item existente (200)', async () => {
    const item = await Item.create({ marca: 'Del', modelo: 'Me', preco: 10 });
    const res = await request(app).delete(`/api/items/${item._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('removido');

    const check = await Item.findById(item._id);
    expect(check).toBeNull();
  });

  it('deve retornar 404 ao excluir ID inexistente', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/items/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
