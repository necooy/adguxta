const mongoose = require('mongoose');

let cachedConnection = null;

/**
 * Conecta ao MongoDB com padrão de cache de conexão para serverless.
 * Reutiliza a conexão existente se disponível, evitando esgotamento de sockets.
 */
async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI não está definida nas variáveis de ambiente.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = conn;
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
}

module.exports = connectDB;
