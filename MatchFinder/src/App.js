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

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app-container">
      {currentUser && <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/discover" /> : <Login />} />
        <Route path="/register" element={<Register setCurrentUser={setCurrentUser} />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
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