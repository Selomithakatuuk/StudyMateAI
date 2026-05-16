import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  BrainCircuit, 
  ChevronLeft, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Zap, 
  GraduationCap,
  Loader2
} from 'lucide-react';
import { chatWithAI } from '../lib/gemini';

const ChatPage = ({ apiKey }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('studymate_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('explain');
  const [subject, setSubject] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('studymate_chat_history', JSON.stringify(messages));
  }, [messages]);

  // API key check removed for simulation mode

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI(apiKey, mode, messages, input, subject);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ **Error:** ${error.message || "Failed to connect to AI. Please check your connection."}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all messages?")) {
      setMessages([]);
      localStorage.removeItem('studymate_chat_history');
    }
  };

  const modes = [
    { id: 'explain', name: 'Explain', icon: <Sparkles size={18} />, color: '#818cf8' },
    { id: 'quiz', name: 'Quiz', icon: <Zap size={18} />, color: '#fbbf24' },
    { id: 'summary', name: 'Summary', icon: <BookOpen size={18} />, color: '#34d399' },
  ];

  const subjects = ["General", "Mathematics", "Science", "History", "Literature", "Computer Science", "Business"];

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className="chat-sidebar glass">
        <div className="sidebar-header" onClick={() => navigate('/')}>
          <BrainCircuit size={28} color="#818cf8" />
          <span>StudyMate<span className="gradient-text">AI</span></span>
        </div>

        <div className="sidebar-section">
          <label>Study Mode</label>
          <div className="mode-selector">
            {modes.map((m) => (
              <button 
                key={m.id}
                className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => setMode(m.id)}
                style={{ '--accent': m.color }}
              >
                {m.icon}
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <label>Subject</label>
          <select 
            className="subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="sidebar-footer">
          <button className="btn-clear" onClick={clearChat}>
            <Trash2 size={16} /> Clear Session
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header glass">
          <div className="header-info">
            <div className="active-mode-badge" style={{ backgroundColor: modes.find(m => m.id === mode).color + '20', color: modes.find(m => m.id === mode).color }}>
              {modes.find(m => m.id === mode).icon}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </div>
            <div className="active-subject">
              <GraduationCap size={16} />
              {subject}
            </div>
          </div>
        </header>

        <div className="messages-area" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="welcome-empty">
              <div className="empty-icon glass"><BrainCircuit size={48} /></div>
              <h2>Ready to learn?</h2>
              <p>Ask me anything about {subject === 'General' ? 'your studies' : subject}. <br /> I'm currently in <strong>{mode} mode</strong>.</p>
              <div className="suggestions">
                <button onClick={() => setInput(`Explain the basics of ${subject}`)}>Explain basics</button>
                <button onClick={() => setInput(`Give me a quiz about ${subject}`)}>Start quiz</button>
                <button onClick={() => setInput(`Summarize key concepts of ${subject}`)}>Get summary</button>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                className={`message-wrapper ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`message-bubble ${msg.role} glass`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble assistant glass loading">
                <Loader2 className="spinner" size={20} />
                <span>StudyMate is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <footer className="chat-input-area">
          <form className="input-form glass" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder={`Ask a question in ${mode} mode...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
              <Send size={20} />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default ChatPage;
