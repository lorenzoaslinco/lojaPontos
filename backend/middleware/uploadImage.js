const multer = require('multer');
const path = require('path');

// Configuração do armazenamento para imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/'); // Pasta para armazenar imagens
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Filtro de arquivo para garantir que apenas imagens sejam aceitas
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Erro: Apenas imagens são permitidas!'), false);
  }
};

// Inicialização do upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // Limite de 524MB
  fileFilter: fileFilter
});

module.exports = upload;
