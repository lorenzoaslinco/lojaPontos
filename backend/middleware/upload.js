const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/users/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Filtro de arquivo para garantir que apenas arquivos CSV sejam aceitos
const fileFilter = (req, file, cb) => {
  const fileTypes = /csv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Erro: Apenas arquivos CSV são permitidos!'), false);
  }
};

// Inicialização do upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB
  fileFilter: fileFilter
});

module.exports = upload;
