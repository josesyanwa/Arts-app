import React, { useState } from 'react';
import './LogIn.css';
import { useNavigate } from 'react-router-dom'; 

const Login = ({ onRequestClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleArtistLogin = () => {
    const userData = {
      email: username,
      password: password
    };

    fetch('http://127.0.0.1:5555/artists/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error logging in artist: ' + response.status);
        }
        setErrorMessage('Artist login successful!');
        return response.json();
      })
      .then((user) => {
        localStorage.setItem("JWT", user.access_token);
        navigate('/artworks', { state: { userData: user } });
        onRequestClose();
      })
      .catch((error) => {
        setErrorMessage('Error logging in artist: ' + error.message);
      });
  };

  const handleUserLogin = () => {
    const userData = {
      username: username,
      password: password
    };

    fetch('http://127.0.0.1:5555/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error logging in user: ' + response.status);
        }
        setErrorMessage('User login successful!');
        return response.json();
      })
      .then((user) => {
        localStorage.setItem("JWT", user.access_token);
        navigate('/artworks', { state: { userData: user } });
        onRequestClose();
      })
      .catch((error) => {
        setErrorMessage('Error logging in user: ' + error.message);
      });
  };

  return (
    <div className="login-container">
      <div>
        <button className="close-button" onClick={onRequestClose}>
          &times; {/* "x" character for a cross icon */}
        </button>
      </div>
      <h2>Login</h2>
      <form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label>
          Username/Email:
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleArtistLogin}>
          Artist Login
        </button>
        <button type="button" onClick={handleUserLogin}>
          User Login
        </button>
      </form>
    </div>
  );
};

export default Login;
