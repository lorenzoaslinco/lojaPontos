// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Autenticação falhou: Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;

