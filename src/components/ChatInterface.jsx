
import React, { useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";

const ChatInterface = ({ code }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm here to help you understand this codebase. You can ask me questions about the code structure, functionality, or any specific files. What would you like to know?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chat-with-code', {
        message: userMessage,
        code: code
      });

      // Add bot response to chat
      setMessages(prev => [...prev, { type: 'bot', content: response.data.response }]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Sorry, I encountered an error processing your question. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Chat with Your Code</h2>
        <p>Ask questions about the repository structure, functionality, or specific files</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-content">
              <pre>{message.content}</pre>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message bot">
            <div className="message-icon">
              <FaRobot />
            </div>
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the code structure, functionality, or specific files..."
          disabled={loading}
          rows="3"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputMessage.trim()}
          className="send-btn"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
