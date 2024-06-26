import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Shop from './components/Shop/Shop';
import UserList from './components/UserList/UserList';
import UserDetails from './components/UserDetails/UserDetails';
import Login from './components/Login/Login';
import AdminLogin from './components/AdminLogin/AdminLogin';
import Navbar from './components/Navbar/Navbar';
import ProductForm from './components/ProductForm/ProductForm';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminProducts from './components/AdminProducts/AdminProducts';
import AdminOrders from './components/AdminOrders/AdminOrders';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);
  const [userPoints, setUserPoints] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUserPoints(decoded.points);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Token inválido", error);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
      }
    } else {
      setRole(null);
    }
  }, [token]);

  const setTokenInLocalStorage = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setUserPoints(decoded.points);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setToken(null);
      setRole(null);
      setUserPoints(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <Router>
      <div className='App'>
        <Navbar token={token} setToken={setTokenInLocalStorage} role={role} userPoints={userPoints} />
        <Routes>
          <Route path="/" element={<Shop token={token} userPoints={userPoints} setUserPoints={setUserPoints} />} />
          <Route path='/login' element={<Login setToken={setTokenInLocalStorage} setUserPoints={setUserPoints} />} />
          <Route path="/admin" element={<AdminLogin setToken={setTokenInLocalStorage} />} />
          <Route path='/admin/dashboard' element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin" />} />
          <Route path='/users' element={role === 'admin' ? <UserList /> : <Navigate to="/admin" />} />
          <Route path='/users/:id' element={role === 'admin' ? <UserDetails /> : <Navigate to="/admin" />} />
          <Route path='/admin/products' element={role === 'admin' ? <AdminProducts /> : <Navigate to="/admin" />} />
          <Route path='/admin/add-product' element={role === 'admin' ? <ProductForm /> : <Navigate to="/admin" />} />
          <Route path='/admin/orders' element={role === 'admin' ? <AdminOrders token={token} /> : <Navigate to="/admin" />} />
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
