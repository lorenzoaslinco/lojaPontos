import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProductList.css';
import coinIcon from '../../images/coin.png';

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
      <hr></hr>
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="product-item">
                <td className="productImg">
                  <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="product-image" />
                </td>
                <td className="productName">{product.name}</td>
                <td className="productDescription">{product.description}</td>
                <td className="productPrice">
                  <img src={coinIcon} alt="ponto" className="point-icon" />
                  {product.price}
                </td>
                <td className="deleteProduct">
                  {isAdmin && <button onClick={() => handleDelete(product._id)}>Excluir</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
