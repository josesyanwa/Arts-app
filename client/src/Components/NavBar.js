// NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './NavBar.css';
import SignUp from './SignUp';
import LogIn from './LogIn';

const NavBar = () => {
  const navigate = useNavigate(); 
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState('');
  const [artistName, setArtistName] = useState('');

  // const handleInputChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleSearch = () => {
    
    if (!artistName.trim()) {
      // Artist name is empty or contains only whitespace
      alert('Please enter a valid artist name');
      return;
    }
    // Send search query to backend
    fetch(`http://localhost:5555/arts/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artist_name: artistName }),
    })
    .then((response) => {
      if (response.status === 404) {
        // Artist not found in the database
        console.error('Artist not found');
      }
      return response.json();
    })
      .then((data) => {
        if (data.length === 0) {
          // Artist does not exist in the database
          alert('Artist does not exist');
        } else {
          // Navigate to result page with search results
          navigate('/result', { state: { data } });
        }
      })
      .catch((error) => {
        console.error('Error searching for artist:', error);
      });
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <div className="logo">
          <img src="/Assets/logo.png" alt="Logo" />
        </div>
      </Link>

      <div className="search-bar">
        <button onClick={handleSearch}>Q</button>
        <input
          type="text"
          placeholder="Search artist..."
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <button className="signup-button" onClick={openSignUpModal}>
          Sign Up
        </button>
        <button className="login-button" onClick={openLoginModal}>
          Login
        </button>
        <Link to="/artworks">Artworks</Link>
        <Link to="/more">More</Link>
      </div>

      {isSignUpModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <SignUp onClose={closeSignUpModal} />
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <LogIn onRequestClose={closeLoginModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
