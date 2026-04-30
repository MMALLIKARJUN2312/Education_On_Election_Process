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
    } catch {
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
    <div className="glass-card" role="region" aria-label="Election Q&A Assistant">
      <h2 id="assistant-title">Interactive Assistant</h2>
      <div 
        className="chat-container" 
        role="log" 
        aria-live="polite" 
        aria-relevant="additions"
        aria-labelledby="assistant-title"
      >
        {messages.map((msg) => (
          <article 
            key={msg.id} 
            className={`message ${msg.sender}`}
            aria-label={`${msg.sender === 'user' ? 'You' : 'Assistant'} said:`}
          >
            <p>{msg.text}</p>
            {msg.details && msg.details.steps && msg.details.steps.length > 0 && (
              <section className="bot-steps">
                <h3>Steps:</h3>
                <ul>
                  {msg.details.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </section>
            )}
            {msg.details && msg.details.relatedTerms && msg.details.relatedTerms.length > 0 && (
              <section className="bot-terms">
                <strong>Related Terms:</strong>
                <ul>
                  {msg.details.relatedTerms.map((rt, idx) => (
                    <li key={idx}>
                      <dfn>{rt.term}</dfn>: {rt.definition}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        ))}
        {loading && (
          <div className="message bot" aria-busy="true" aria-label="Thinking...">
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span>Processing your question...</span>
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about voter registration, polling stations, etc."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          aria-label="Your question about the election process"
          aria-required="true"
        />
        <button 
          onClick={handleSend} 
          disabled={loading || !input.trim()} 
          aria-label="Send message"
          type="button"
        >
          <Send size={18} aria-hidden="true" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

