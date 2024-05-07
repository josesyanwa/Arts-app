import React from 'react';
import { useLocation } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const location = useLocation();
  const data = location.state?.data;

  if (!data || data.length === 0) {
    return <div className="result-container">No data available</div>;
  }

  // Check if the data contains a message indicating artist not found
  if (typeof data === 'object' && data.message === 'Artist not found') {
    return <div className="result-container">Artist not found</div>;
  }

  // Assuming data is an array of art objects
  return (
    <div className="result-container">
      {data.map((art) => (
        <div key={art.id} className="art-card">
          <h2 className="art-title">{art.title}</h2>
          <p className="artist-info">Artist: {art.artist}</p>
          <p className="art-price">Price: {art.price}</p>
          <img src={art.image_path} alt={art.title} className="art-image" />
        </div>
      ))}
    </div>
  );
};

export default Result;
