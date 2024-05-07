import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom'; 

const Signup = ({ onClose }) => {
  const [userType, setUserType] = useState('artist');
  const [artistFormData, setArtistFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleArtistChange = (event) => {
    const { name, value } = event.target;
    setArtistFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleArtistSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = artistFormData;
    const data = { name, email, password };

    if (!data.password) {
      setErrorMessage('Password is required');
      return;
    }

    fetch('http://127.0.0.1:5555/artists/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 409) {
            setErrorMessage('Email already exists');
            return;
          }
          throw new Error('Error registering artist: ' + response.status);
        }
        setErrorMessage('');
        console.log('Artist sign up successful!');
        navigate('/');
        onClose();
      })
      .catch((error) => {
        console.error('Error registering artist:', error.message);
        setErrorMessage('Error registering artist: ' + error.message);
      });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();

    const { username, password } = userFormData;
    const data = { username, password };

    if (!data.password) {
      setErrorMessage('Password is required');
      return;
    }

    fetch('http://127.0.0.1:5555/users/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 409) {
            setErrorMessage('Username already exists');
            return;
          }
          throw new Error('Error registering user: ' + response.status);
        }
        setErrorMessage('');
        console.log('User sign up successful!');
        navigate('/');
        onClose();
      })
      .catch((error) => {
        console.error('Error registering user:', error.message);
        setErrorMessage('Error registering user: ' + error.message);
      });
  };

  return (
    <div className="signup-modal">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2>Sign Up</h2>
      <label className="artist-label">
        <input
          type="radio"
          value="artist"
          checked={userType === 'artist'}
          onChange={handleUserTypeChange}
        />
        Artist
      </label>
      <label className="user-label">
        <input
          type="radio"
          value="user"
          checked={userType === 'user'}
          onChange={handleUserTypeChange}
        />
        User
      </label>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {userType === 'artist' ? (
        <form onSubmit={handleArtistSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={artistFormData.name}
            onChange={handleArtistChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={artistFormData.email}
            onChange={handleArtistChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={artistFormData.password}
            onChange={handleArtistChange}
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleUserSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userFormData.username}
            onChange={handleUserChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userFormData.password}
            onChange={handleUserChange}
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
