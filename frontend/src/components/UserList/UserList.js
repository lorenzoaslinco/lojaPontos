import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../PageTitle/PageTitle";
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [points, setPoints] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
    }
  };

  const handleAddPoints = (userId) => {
    const token = localStorage.getItem('token');
    const pointsToAdd = points[userId] || 0;

    axios.post('http://localhost:5000/api/users/addPoints', { userId, points: pointsToAdd }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(users.map((user) => (user._id === userId ? response.data : user)));
        setPoints({ ...points, [userId]: 0 });
      })
      .catch(error => console.error('Erro ao adicionar pontos:', error));
  };

  const handlePointsChange = (userId, value) => {
    setPoints({ ...points, [userId]: Number(value) });
  };

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <>
      <PageTitle title="Gerenciador de Usuário" />
      <div className='wrapper userListWrapper'>
        <h2>Lista de Usuários</h2>
        <hr></hr>
        <div className='userList'>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Pontos</th>
                <th>Adicionar Pontos</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} onClick={() => handleRowClick(user._id)} style={{ cursor: 'pointer' }}>
                  <td className="userEmail">{user.email}</td>
                  <td className="userPoints">{user.points}</td>
                  <td>
                    <input
                      type="number"
                      value={points[user._id] || 0}
                      onChange={(e) => handlePointsChange(user._id, e.target.value)}
                      id={"points" + user.email}
                      autoComplete="off"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); handleAddPoints(user._id); }}>Adicionar Pontos</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserList;
