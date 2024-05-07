import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import NavBar from './Components/NavBar';
import SignUp from './Components/SignUp'; 
import LogIn from './Components/LogIn'; 
import Artworks from './Components/ArtWorks'; 
import More from './Components/More'; 
import About from './Components/About';
import Logout from './Components/Logout';
import PostArt from './Components/PostArt';
import CommentSection from './Components/CommentSection';
import Result from './Components/Result';

const App = () => {
  const [setUser] = useState(null);

  useEffect(() => {
    
    fetch('/check_session',{
    method: 'GET',
    headers: {
      'Authorization':`Bearer ${localStorage.getItem('JWT')}`
    }}
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUser(data)
          
        
      })
      .catch(error => {
        console.error('Error checking session:', error);
      });
  }, [setUser]);

  return (
    <Router>
      <div>
        <NavBar  />
        <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn  />} />
          <Route path="/artworks" element={<Artworks />} />
          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route path="/more" element={<More />} />
          <Route path="/about" element={<About />} />
          <Route path="/logout" element={<Logout  />} />
          <Route path="/postArt" element={<PostArt  />} />
          <Route path= "/CommentSection" element= {<CommentSection/>}/>
          <Route path="/result" element={<Result  />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
