import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const { data } = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (onProductAdded) onProductAdded(data);
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      navigate('/admin/products');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='image'>Imagem do Produto:</label>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} required id='image' />
        </div>
        <div>
          <label htmlFor='productName'>Nome do Produto:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required id='productName' />
        </div>
        <div>
          <label htmlFor='description'>Descrição:</label>
          <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} required id='description' />
        </div>
        <div>
          <label htmlFor='price'>Preço:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required id='price' />
        </div>
        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default ProductForm;
