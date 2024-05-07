import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Logout.css'; 

const Logout = () => {
  const navigate = useNavigate(); 

  function handleLogout() {
    localStorage.removeItem('JWT');
    navigate('/');
  }
  console.log();

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h1>Logout</h1>
        <p>Are you sure you want to logout?</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
