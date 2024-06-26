const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const uploadImage = require('../middleware/uploadImage');

// Rota para adicionar um novo produto
router.post('/', uploadImage.single('image'), async (req, res) => {
  console.log('Corpo da requisição:', req.body);
  console.log('Arquivo de imagem:', req.file);

  const { name, description, price } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  if (!imageUrl) {
    return res.status(400).json({ message: 'A imagem do produto é obrigatória' });
  }

  try {
    const product = new Product({ name, description, price, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao salvar produto:', err);
    res.status(500).json({ message: err.message });
  }
});

// Rota para listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ message: err.message });
  }
});

// Rota para excluir um produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    await product.deleteOne();
    res.json({ message: 'Produto excluído' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
