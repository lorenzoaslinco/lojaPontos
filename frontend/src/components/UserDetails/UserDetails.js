import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '../PageTitle/PageTitle';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handlePasswordReset = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/resetPassword`, { password: newPassword });
      alert('Senha redefinida com sucesso');
      setNewPassword('');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Erro ao carregar os dados do usuário.</div>;
  }

  return (
    <>
      <PageTitle title={`Usuário: ${user.email}`} />
      <div>
        <h2>Detalhes do Usuário</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Pontos:</strong> {user.points}</p>
        <div>
          <h3>Redefinir Senha</h3>
          <input
            type="password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordReset}>Redefinir Senha</button>
        </div>
        <button onClick={() => navigate('/users')}>Voltar</button>
      </div>
    </>
  );
};

export default UserDetails;
