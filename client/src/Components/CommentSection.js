import React, { useState, useEffect } from 'react';
import './CommentSection.css';

const CommentSection = ({ artwork }) => {
  // Extract artworkId from artwork data
  const artworkId = artwork.id;

  // State to store comments for this artwork
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  // const [error, setError] = useState(null);

  // FUNCTION TO FETCH COMMENTS
  useEffect(() => {
    fetch(`http://localhost:5555/arts/${artworkId}/comments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        return response.json();
      })
      .then(data => setComments(data))
      // .catch(error => setError(error.message));
  }, [artworkId]);

  // Function to handle posting a new comment for artists

  const handlePostArtistComment = () => {
    fetch('http://localhost:5555/artists/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('JWT')}`
      },
      body: JSON.stringify({
        text: newComment,
        art_id: artworkId
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error posting comment: ' + response.status);
        }
        console.log('Posting artist comment successful!');
        return response.json();
      })
      .then(data => {
        // If successfully posted, add the new comment to the comments list
        setComments([...comments, {
          text: newComment,
          author_name: 'Artist'
        }]);
        // Clear the input field
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error posting artist comment:', error.message);
      });
  };

  // Function to handle posting a new comment for users

  const handlePostUserComment = () => {
    fetch('http://localhost:5555/users/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('JWT')}`
      },
      body: JSON.stringify({
        text: newComment,
        art_id: artworkId
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error posting comment: ' + response.status);
        }
        console.log('Posting user comment successful!');
        return response.json();
      })
      .then(data => {
        // If successfully posted, add the new comment to the comments list
        setComments([...comments, {
          text: newComment,
          author_name: 'User'
        }]);
        // Clear the input field
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error posting user comment:', error.message);
      });
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-heading">Comments</h3>
      {comments.length > 0 ? (
        <ul className="comment-list">
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <p className="author-name">Author: {comment.author_name}</p>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments-message">No comments yet</p>
      )}
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="comment here..."
      />

      {/* Button to post comment for artists */}
      <button onClick={handlePostArtistComment}>Artist's Comment</button>

      {/* Button to post comment for users */}
      <button onClick={handlePostUserComment}>User's Comment</button>
    </div>
  );
};

export default CommentSection;
