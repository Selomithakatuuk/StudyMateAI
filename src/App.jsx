import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  const handleSetApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage apiKey={apiKey} onSetApiKey={handleSetApiKey} />} />
          <Route path="/chat" element={<ChatPage apiKey={apiKey} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
