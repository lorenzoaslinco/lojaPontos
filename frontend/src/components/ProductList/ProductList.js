import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProductList.css';

const ProductList = ({ isAdmin }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto');
    }
  };

  return (
    <div className="wrapper">
      <h2>Lista de Produtos</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="product-image" />
            <span>{product.name} - {product.description} - ${product.price.toFixed(2)}</span>
            {isAdmin && <button onClick={() => handleDelete(product._id)}>Excluir</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
