import React from 'react';
import UserImport from '../UserImport/UserImport';
import UserList from '../UserList/UserList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className='wrapper adminDashboardWrapper'>
      <h1>Painel do Administrador</h1>
      <UserImport />
      <hr></hr>
      <UserList />
    </div>
  );
};

export default AdminDashboard;
