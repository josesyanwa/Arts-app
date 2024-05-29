import React, { useState, useEffect } from 'react';
import './ArtWork.css';
import PostArt from './PostArt'; // Import the PostArt component
import CommentSection from './CommentSection';
import { useLocation } from 'react-router-dom';

const ArtWorks = () => {
  const location = useLocation();
  const { userData } = location.state || {};

  const [artworks, setArtworks] = useState([]);
  // const [error, setError] = useState(null);
  const [showPostArtForm, setShowPostArtForm] = useState(false); // State to track whether to display the post art form

  // Function to fetch artworks from the backend
  const fetchArtworks = () => {
    fetch('http://localhost:5555/arts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        return response.json();
      })
      .then(data => setArtworks(data.reverse())) // Reverse the order to show newest artworks first
      // .catch(error => setError(error.message));
  };

  // Effect to fetch artworks on component mount and set up interval for automatic updates
  useEffect(() => {
    fetchArtworks();
    const intervalId = setInterval(fetchArtworks, 2000); // Fetch artworks every 2 seconds
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Function to handle button click to show/hide the post art form
  const handlePostArtButtonClick = () => {
    setShowPostArtForm(!showPostArtForm);
  };

  return (
    <div className="centered-container">
      <h1 className="heading">Welcome {userData && userData.username} to Artman!</h1>

      {/* Button to toggle the visibility of the post art form */}
      <button className="post-art-button" onClick={handlePostArtButtonClick}>Post Art</button>

      {/* Render the PostArt component conditionally */}
      {showPostArtForm && <PostArt />}

      <div className="artworks-container">
        {artworks.length > 0 ? (
          <div className="artworks-list">
            {artworks.map(artwork => (
              <div key={artwork.id} className="artwork-item">
                <img
                  src={artwork.image_path}
                  alt={artwork.title}
                  style={{ maxWidth: '250px', height: 'auto' }} 
                />
                <p>{artwork.title}</p>
                <p>{artwork.artist}</p>
                <p>{artwork.price}</p>
                {/* Render the CommentSection component */}
                <CommentSection className="comment-section" artwork={artwork} />
              </div>
            ))}
          </div>
        ) : (
          <p>No artworks available</p>
        )}
      </div>
    </div>
  );
};

export default ArtWorks;