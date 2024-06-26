import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../PageTitle/PageTitle";
import './AdminOrders.css';

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <>
      <PageTitle title="Pedidos" />
      <div className="wrapper orderListWrapper">
        <h2>Lista de Pedidos</h2>
        <hr></hr>
        <div className="order-list">
          <table>
              <thead>
                <tr>
                  <th>Usuário (Email)</th>
                  <th>Produto</th>
                  <th>Endereço</th>
                  <th>Data do Pedido</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="order-item">
                    <td className="userEmail">{order.user.email}</td>
                    <td className="productName">{order.product.name}</td>
                    <td className="orderAddress">{order.address}</td>
                    <td className="dateOrder">{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;