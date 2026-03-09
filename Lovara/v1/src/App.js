import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    const storedToken = sessionStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
      // Set the authorization header for future requests
      if (storedToken) {
        // This would be handled by axios interceptors or similar in a real app
      }
    }
  }, []);

  const handleLogin = async (userData, token) => {
    setCurrentUser(userData);
    setAuthToken(token);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('authToken', token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
  };

  return (
    <div className="app-container">
      {currentUser && <Navbar currentUser={currentUser} setCurrentUser={handleLogout} />}
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/discover" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/discover" element={currentUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={currentUser ? <Profile user={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/matches" element={currentUser ? <Matches /> : <Navigate to="/login" />} />
        <Route path="/messages" element={currentUser ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/settings" element={currentUser ? <Settings user={currentUser} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;