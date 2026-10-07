const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const app = require('./api/app');
const connectDB = require('./api/config/db');

const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback para o frontend (SPA-like)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`API disponível em http://localhost:${PORT}/api/items`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();
