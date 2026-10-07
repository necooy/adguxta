const Item = require('../models/Item');

/**
 * @desc    Lista todos os itens de segurança, ordenados do mais recente.
 * @route   GET /api/items
 */
async function getItems(req, res, next) {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Retorna um item pelo ID.
 * @route   GET /api/items/:id
 */
async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Item não encontrado com o ID informado.',
      });
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Cria um novo item de segurança.
 * @route   POST /api/items
 */
async function createItem(req, res, next) {
  try {
    const { marca, modelo, preco, foto } = req.body;

    // Validação de campos obrigatórios na camada de controle
    const missing = [];
    if (!marca || (typeof marca === 'string' && marca.trim().length === 0)) missing.push('marca');
    if (!modelo || (typeof modelo === 'string' && modelo.trim().length === 0)) missing.push('modelo');
    if (preco === undefined || preco === null || preco === '') missing.push('preço');

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: `Campos obrigatórios ausentes: ${missing.join(', ')}.`,
      });
    }

    const item = await Item.create({ marca, modelo, preco, foto: foto || '' });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Atualiza um item existente.
 * @route   PUT /api/items/:id
 */
async function updateItem(req, res, next) {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Item não encontrado com o ID informado.',
      });
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Remove um item pelo ID.
 * @route   DELETE /api/items/:id
 */
async function deleteItem(req, res, next) {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Item não encontrado com o ID informado.',
      });
    }

    res.status(200).json({
      message: 'Item removido com sucesso.',
      item,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
