import React, { useState } from 'react';
import axios from 'axios';
import './UserImport.css';

const UserImport = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('Nenhum arquivo selecionado');
  const [messageType, setMessageType] = useState('infoInicial');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      if (validFileType(selectedFile)) {
        setMessage(`Arquivo selecionado: ${selectedFile.name}, tamanho do arquivo: ${returnFileSize(selectedFile.size)}.`);
        setMessageType('info');
      } else {
        setMessage(`Arquivo ${selectedFile.name}: Tipo de arquivo não válido. Selecione um arquivo CSV.`);
        setMessageType('error');
      }
    } else {
      setMessage('Nenhum arquivo selecionado ainda');
      setMessageType('info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessageType('warn');
      setMessage('Por favor, selecione um arquivo CSV antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await axios.post('http://localhost:5000/api/users/import-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessageType('success');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Erro ao importar usuários:', error);
      setMessageType('error');
      setMessage('Erro ao importar usuários');
    }
  };

  const validFileType = (file) => {
    return file.type === 'text/csv';
  };

  const returnFileSize = (number) => {
    if (number < 1000) {
      return `${number} bytes`;
    } else if (number >= 1000 && number < 1000000) {
      return `${(number / 1000).toFixed(1)} KB`;
    } else {
      return `${(number / 1000000).toFixed(1)} MB`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className='userImportForm'>
      <div className='csvForm'>
        <label htmlFor="file">Selecione o arquivo CSV</label>
        <input type="file" id="file" accept=".csv" name='file' onChange={handleFileChange} />
      </div>
      <div className='preview'>
        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>
      <div className='buttonForm'>
        <button type="submit">Importar Usuários</button>
      </div>
    </form>
  );
};

export default UserImport;
