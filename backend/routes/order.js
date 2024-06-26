const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
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

// Rota para cancelar um pedido
router.post('/cancel/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user').populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const user = await User.findById(order.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.points += order.product.price;
    await user.save();
    await order.remove();

    res.json({ message: 'Pedido cancelado e pontos retornados ao usuário' });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({ message: 'Erro ao cancelar pedido', error });
  }
});

module.exports = router;