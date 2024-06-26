const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Rota para buscar todos os pedidos
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error });
  }
});

module.exports = router;