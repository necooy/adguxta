const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'A marca é obrigatória.'],
      trim: true,
      minlength: [1, 'A marca não pode ser vazia.'],
    },
    modelo: {
      type: String,
      required: [true, 'O modelo é obrigatório.'],
      trim: true,
      minlength: [1, 'O modelo não pode ser vazio.'],
    },
    preco: {
      type: Number,
      required: [true, 'O preço é obrigatório.'],
      min: [0, 'O preço deve ser maior ou igual a zero.'],
    },
    foto: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (value) {
          if (!value || value === '') return true;
          return /^https?:\/\/.+\..+/.test(value);
        },
        message: 'A URL da foto deve ser um endereço HTTP ou HTTPS válido.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Item', itemSchema);
