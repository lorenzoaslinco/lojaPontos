import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../PageTitle/PageTitle';
import './Login.css';

const Login = ({ setToken, setUserPoints }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/userLogin', { email, password });
      setToken(data.token);
      setUserPoints(data.points);
      setMessageType('success');
      setMessage('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessageType('error');
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <>
      <PageTitle title="Página de Login" />
      <form onSubmit={handleSubmit} className='wrapper login-user'>
        <div className='container--emailLogin'>
          <label htmlFor='email'>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id='email' autoComplete='on' />
        </div>
        <div className='container--passwordLogin'>
          <label htmlFor='password'>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id='password' autoComplete='on' />
        </div>
        <button type="submit">Login</button>
        {message && <p className={`message ${messageType}`}>{message}</p>}
      </form>
    </>
  );
};

export default Login;
