import React, { useState } from 'react';
import { askElectionQuestion, type AIResponse } from '../api/electionService';
import { Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  details?: AIResponse;
}

export const QnAAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1', sender: 'bot', text: 'Hello! I am here to help you understand the election process in a factual and neutral way. What would you like to know?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askElectionQuestion(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.answer,
        details: response
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2>Interactive Assistant</h2>
      <div className="chat-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            {msg.details && msg.details.steps && msg.details.steps.length > 0 && (
              <ul className="bot-steps">
                {msg.details.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            )}
            {msg.details && msg.details.relatedTerms && msg.details.relatedTerms.length > 0 && (
              <div className="bot-terms">
                <strong>Related Terms:</strong>
                <ul>
                  {msg.details.relatedTerms.map((rt, idx) => (
                    <li key={idx}>{rt.term}: {rt.definition}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about voter registration, polling stations, etc."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          aria-label="Ask a question about elections"
        />
        <button onClick={handleSend} disabled={loading} aria-label="Send message">
          <Send size={18} /> Send
        </button>
      </div>
    </div>
  );
};
