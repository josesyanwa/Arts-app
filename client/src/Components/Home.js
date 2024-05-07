import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Home.css'; 

function Home({ userData }) {
  const [artwork, setArtwork] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    
    fetch('http://localhost:5555/arts')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setArtwork(data[randomIndex]);
        } else {
          setError('No artworks found');
        }
      })
      .catch((error) => {
        console.error('Error fetching artwork:', error);
        setError('Error fetching artwork');
      });
  }, []);

  const handleGetAccountClick = () => {
    // Redirect to the SignUp page when "Get Free Account" button is clicked
    navigate('/signup');
  };

  const handleLearnMoreClick = () => {
    // Redirect to the About page when "Learn More" button is clicked
    navigate('/about');
  };

  console.log(userData);

  return (
    <div className="home-container">
      <div className="description-container">
        <h1>Interact with Arts</h1>
        <p>Are you an Art maniac? Then you are in the right place.</p>
        {error && <p className="error-message">{error}</p>}
        <div className="buttons-container">
          <button className="get-account-button" onClick={handleGetAccountClick}>Get Free Account</button>
          <button className="learn-more-button" onClick={handleLearnMoreClick}>Learn More</button>
        </div>
      </div>
      <div className="image-container">
        {artwork && (
          <div>
            <img
              src={artwork.image_path}
              alt={artwork.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <p>{artwork.title}</p>
            <p>{artwork.artist}</p>
            <p>{artwork.price}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
