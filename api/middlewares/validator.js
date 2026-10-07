const mongoose = require('mongoose');

/**
 * Valida e sanitiza os dados de entrada para criação/atualização de itens.
 */
function validateItemInput(req, res, next) {
  const { marca, modelo, preco, foto } = req.body;
  const errors = [];

  // Validação de marca
  if (marca !== undefined) {
    if (typeof marca !== 'string' || marca.trim().length === 0) {
      errors.push('A marca é obrigatória e não pode ser vazia.');
    } else {
      req.body.marca = marca.trim();
    }
  }

  // Validação de modelo
  if (modelo !== undefined) {
    if (typeof modelo !== 'string' || modelo.trim().length === 0) {
      errors.push('O modelo é obrigatório e não pode ser vazio.');
    } else {
      req.body.modelo = modelo.trim();
    }
  }

  // Validação de preço
  if (preco !== undefined) {
    const precoNum = Number(preco);
    if (isNaN(precoNum)) {
      errors.push('O preço deve ser um número válido.');
    } else if (precoNum < 0) {
      errors.push('O preço deve ser maior ou igual a zero.');
    } else {
      req.body.preco = precoNum;
    }
  }

  // Validação de foto (URL)
  if (foto !== undefined && foto !== null && foto !== '') {
    if (typeof foto !== 'string') {
      errors.push('A URL da foto deve ser uma string.');
    } else {
      const trimmed = foto.trim();
      if (trimmed && !/^https?:\/\/.+\..+/.test(trimmed)) {
        errors.push('A URL da foto deve ser um endereço HTTP ou HTTPS válido.');
      }
      req.body.foto = trimmed;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: errors.join(' '),
      details: errors,
    });
  }

  next();
}

/**
 * Valida se o parâmetro :id é um ObjectId válido do MongoDB.
 */
function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'O ID fornecido não é um identificador válido.',
    });
  }

  next();
}

module.exports = { validateItemInput, validateObjectId };
