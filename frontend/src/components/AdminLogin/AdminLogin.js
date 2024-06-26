import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageTitle from '../PageTitle/PageTitle';
import './AdminLogin.css';

const AdminLogin = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setToken(data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      if (username === '' && password === '') {
        setError('Campos de Usuário e Senha são obrigatórios!');
      } else if (password === '') {
        setError('Campo de Senha é obrigatório!');
      } else if (username === '') {
        setError('Campo de Usuário é obrigatório!');
      } else {
        setError('Erro ao fazer login. Verifique usuário/senha e tente novamente.');
      }
    }
  };

  return (
    <>
      <PageTitle title="Login do Admin" />
      <form onSubmit={handleSubmit} className="wrapper login-admin">
        <div className="container--usernameAdmin">
          <label htmlFor="usernameAdmin">Usuário:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} id="usernameAdmin" autoComplete="on" />
        </div>
        <div className="container--passwordAdmin">
          <label htmlFor="passwordAdmin">Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="passwordAdmin" autoComplete="on" />
        </div>
        {error && <p className="errorLoginAdmin">{error}</p>}
        <button type="submit">Login Admin</button>
      </form>
    </>
  );
};

export default AdminLogin;
