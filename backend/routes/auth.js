const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');

const router = express.Router();

// Login de administradores
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login de usuários
router.post('/userLogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user._id, role: 'user', points: user.points }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, points: user.points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
