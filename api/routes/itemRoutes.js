const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { validateItemInput, validateObjectId } = require('../middlewares/validator');

// GET /api/items - Lista todos os itens
router.get('/', getItems);

// GET /api/items/:id - Retorna item por ID
router.get('/:id', validateObjectId, getItemById);

// POST /api/items - Cria novo item
router.post('/', validateItemInput, createItem);

// PUT /api/items/:id - Atualiza item existente
router.put('/:id', validateObjectId, validateItemInput, updateItem);

// DELETE /api/items/:id - Remove item
router.delete('/:id', validateObjectId, deleteItem);

module.exports = router;
