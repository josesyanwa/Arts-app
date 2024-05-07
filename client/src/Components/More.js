import React from 'react';
import { Link } from 'react-router-dom';
import './More.css';

const More = () => {
  return (
    <div className="container">
      <h1>Welcome to My Site!</h1>
      <nav className="button-container">
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/logout">Sign Out</Link>
          </li>
        </ul>
      </nav>
      {/* Add any other content you want on your home page */}
    </div>
  );
};

export default More;
