import React, { useState } from 'react';
import './PostArt.css';

const PostArt = ({ userData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleButtonClick = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5555/artists/arts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JWT')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to post artwork');
      }
      // Reset form fields
      setTitle('');
      setPrice('');
      setFile(null);
      setIsFormOpen(false);
      setErrorMessage('Artwork posted successfully');
    } catch (error) {
      console.error('Error posting artwork:', error);
      setErrorMessage('Error posting artwork: ' + error.message);
    }
  };

  return (
    <div className="post-art-container">
      <h1 className="headings">Only Artists can post artworks!</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="post-art-button" onClick={handleButtonClick}>Post Art</button>
      {isFormOpen && (
        <form className="post-art-form" onSubmit={handleSubmit}>
          <label>
            Title:
            <input className="post-art-input" type="text" value={title} onChange={handleTitleChange} />
          </label>
          <label>
            Price:
            <input className="post-art-input" type="number" value={price} onChange={handlePriceChange} />
          </label>
          <label>
            Upload File:
            <input className="post-art-input" type="file" onChange={handleFileChange} />
          </label>
          <button className="post-art-submit-button" type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default PostArt;
