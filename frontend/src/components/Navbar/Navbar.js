import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ token, setToken, role, userPoints }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  return (
    <nav>
      <ul className='ul-nav'>
        <li className='li-nav li-nav--logo'>
          <Link to="/">
            <img src='logoD.png' alt='logo' width="75px" height='75px' />
          </Link>
        </li>
        <li className='li-nav'>
          <Link to="/">Loja</Link>
        </li>
        {token ? (
          <>
            {role === 'admin' && (
              <>
                <li className='li-nav'>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className='li-nav'>
                  <Link to="/admin/products">Produtos</Link>
                </li>
                <li className='li-nav'>
                  <Link to="/admin/orders">Pedidos</Link>
                </li>
              </>
            )}
            {role === 'user' && (
              <li className='li-nav'>
                <p className='userPoints'>Pontos: <span className='points'>{userPoints}</span></p>
              </li>
            )}
            <li className='li-nav'>
              <button onClick={handleLogout} className='logout'>Logout</button>
            </li>
          </>
        ) : (
          <li className='li-nav'>
            <button onClick={() => navigate('/login')} className='userLogin'>Login</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
