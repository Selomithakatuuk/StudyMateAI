import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Zap, MessageSquare, BrainCircuit, Key, ArrowRight } from 'lucide-react';

const LandingPage = ({ apiKey, onSetApiKey }) => {
  const navigate = useNavigate();
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKeyInput, setShowKeyInput] = useState(false);

  const features = [
    {
      icon: <BrainCircuit className="feature-icon" />,
      title: "Explain Mode",
      desc: "Complex topics broken down into simple, easy-to-understand concepts."
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Quiz Mode",
      desc: "Test your knowledge with AI-generated questions tailored to your material."
    },
    {
      icon: <BookOpen className="feature-icon" />,
      title: "Summary Mode",
      desc: "Get quick TL;DRs and structured notes from long study materials."
    }
  ];

  const handleStart = () => {
    if (!apiKey && !tempKey && !localStorage.getItem('gemini_api_key')) {
      setShowKeyInput(true);
    } else {
      if (tempKey) onSetApiKey(tempKey);
      navigate('/chat');
    }
  };

  return (
    <div className="landing-container">
      <nav className="navbar glass">
        <div className="logo">
          <BrainCircuit size={32} color="#818cf8" />
          <span>StudyMate<span className="gradient-text">AI</span></span>
        </div>
        <div className="nav-links">
          <button className="btn-secondary" onClick={() => setShowKeyInput(true)}>
            {apiKey ? 'Update API Key' : 'Enter API Key'}
          </button>
        </div>
      </nav>

      <main className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Master Any Subject with <br />
            <span className="gradient-text">Personalized AI Tutoring</span>
          </h1>
          <p className="hero-subtitle">
            StudyMate AI is your 24/7 academic companion. Explain complex concepts, 
            generate practice quizzes, and summarize materials in seconds.
          </p>
          
          <div className="cta-group">
            <button className="btn-primary main-cta" onClick={handleStart}>
              Get Started <ArrowRight size={20} />
            </button>
          </div>

          {showKeyInput && (
            <motion.div 
              className="key-input-box glass"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="input-header">
                <Key size={18} />
                <span>Enter Gemini API Key</span>
              </div>
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="key-input"
              />
              <button className="btn-save" onClick={handleStart}>Save & Continue</button>
              <p className="key-hint">Your key is stored locally and never shared.</p>
            </motion.div>
          )}
        </motion.div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              className="feature-card glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              whileHover={{ y: -5, borderColor: 'rgba(129, 140, 248, 0.4)' }}
            >
              <div className="icon-wrapper">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="landing-footer">
        <p>© 2026 StudyMate AI • Built for better learning</p>
      </footer>
    </div>
  );
};

export default LandingPage;
