import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = ({ onUserCreated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users', { email, password });
      onUserCreated(data);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Erro ao criar usuário');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='wrapper createUser'>
      <div className='container--emailForm'>
        <label htmlFor='email'>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id='email' autoComplete='off' />
      </div>
      <div className='container--passwordForm'>
        <label htmlFor='password'>Senha:</label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} id='password' autoComplete='off' />
      </div>
      {error && <p className='errorUserCreation'>{error}</p>}
      <button type="submit" className='addUser'>Criar Usuário</button>
    </form>
  );
};

export default UserForm;
