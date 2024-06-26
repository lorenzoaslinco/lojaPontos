const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const generatePassword = require('../utils/generatePassword');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Função para remover o BOM
const removeBOM = (str) => {
  if (str && str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1);
  }
  return str;
};

// Rota para importar usuários de um arquivo CSV
router.post('/import-csv', auth, upload.single('csv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
  }

  const filePath = req.file.path;
  const users = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const emailField = Object.keys(row)[0];
      const email = removeBOM(row[emailField]);
      if (email) {
        const password = generatePassword();
        const hashedPassword = bcrypt.hashSync(password, 10);
        users.push({ email, password: hashedPassword, points: 0 });
        const emailText = `
          <div>
            <h1>Acesse nossa loja agora mesmo e aproveite os melhores produtos da EsportivaVip!</h1>
            <hr />
            <span><b>Seu login é:</b> ${email}</span>
            <br>
            <span><b>Sua senha é:</b> ${password}</span>
          </div>
        `;
        sendEmail(email, 'Sua nova conta', emailText);
      } else {
        console.log('Email não encontrado na linha CSV:', row);
      }
    })
    .on('end', async () => {
      try {
        if (users.length > 0) {
          await User.insertMany(users);
          res.status(201).json({ message: 'Usuários importados com sucesso' });
        } else {
          res.status(400).json({ message: 'Nenhum usuário válido encontrado no arquivo CSV' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Erro ao importar usuários', error });
      }
    });
});

// Rota para obter todos os usuários
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para obter um usuário específico
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para adicionar pontos a um usuário
router.post('/addPoints', auth, async (req, res) => {
  const { userId, points } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    user.points += points;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para redefinir a senha de um usuário
router.put('/:id/resetPassword', auth, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    user.password = password;
    await user.save();
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para processar a compra e descontar pontos
router.post('/buy', auth, async (req, res) => {
  const { productPrice, address, productId } = req.body;

  try {
    const user = await User.findById(req.admin.id);
    const product = await Product.findById(productId);

    if (user.points >= productPrice) {
      user.points -= productPrice;
      await user.save();

      const order = new Order({
        user: user._id,
        product: product._id,
        address: `${address.street}, ${address.houseNumber} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}${address.complement ? `, ${address.complement}` : ''}`
      });
      await order.save();
      
      res.json({ message: 'Compra realizada com sucesso', updatedPoints: user.points });
    } else {
      res.status(400).json({ message: 'Pontos insuficientes' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar a compra', error });
  }
});

module.exports = router;