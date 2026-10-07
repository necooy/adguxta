/**
 * Middleware centralizado de tratamento de erros.
 * Retorna respostas padronizadas em JSON sem vazamento de stack traces em produção.
 */
function errorHandler(err, req, res, _next) {
  console.error('Erro capturado:', err.message);

  // Erros de validação do Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Erro de validação',
      message: messages.join(' '),
      details: messages,
    });
  }

  // Erros de cast do Mongoose (ex: ObjectId inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'O valor fornecido possui formato inválido.',
    });
  }

  // Erro genérico
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor.'
      : err.message || 'Erro interno do servidor.';

  res.status(statusCode).json({
    error: 'Erro do servidor',
    message,
  });
}

module.exports = errorHandler;
