import React from "react";
import { useNavigate } from "react-router-dom";
import ProductList from '../ProductList/ProductList';

const AdminProducts = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/admin/add-product')}>Adicionar Produto</button>
      <ProductList isAdmin={true} />
    </div>
  );
};

export default AdminProducts;