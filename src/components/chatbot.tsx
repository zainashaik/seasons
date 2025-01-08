"use client"
import { useState } from 'react';

export default function Chatbot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSendMessage = async () => {
      if (!input.trim() || isLoading) return;
  
      try {
        setIsLoading(true);
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userMessage: input // Make sure we're sending just the input text
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (data.botReply) {
          const botMessage = { role: 'assistant', content: data.botReply };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (error) {
        console.error('Error:', error);
        // Optionally add error message to chat
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      } finally {
        setIsLoading(false);
        setInput('');
      }
    };
  
    return (
        <div className="bg-[#4A1942] rounded-lg shadow-lg p-6 h-[80vh] flex flex-col border-2 border-[#893168]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {/* Welcome message */}
            <div className="bg-[#2E1C2B] p-3 rounded-lg max-w-[80%] text-[#EAEAEA] border-l-4 border-[#893168]">
              Hi, I'm your personal cute outfit stylist! Describe an outfit, and I'll give you ideas on how to make it cuter :)
            </div>
    
            {/* Chat messages */}
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${
                  msg.role === 'user' 
                    ? 'ml-auto bg-[#893168] text-[#EAEAEA]' 
                    : 'bg-[#2E1C2B] text-[#EAEAEA]'
                } p-3 rounded-lg max-w-[80%] whitespace-pre-wrap border border-[#893168]/50`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.content}
              </div>
            ))}
    
            {/* Loading indicator */}
            {isLoading && (
              <div className="bg-[#2E1C2B] p-3 rounded-lg max-w-[80%] text-[#EAEAEA] animate-pulse border border-[#893168]/50">
                Thinking...
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Describe an outfit..."
              className="flex-1 p-2 rounded-lg border-2 border-[#893168] 
                       bg-[#2E1C2B]
                       text-[#EAEAEA]
                       placeholder-[#EAEAEA]/50
                       focus:outline-none focus:ring-2 focus:ring-[#893168]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button 
              className="bg-[#893168] hover:bg-[#4A1942] text-[#EAEAEA] px-4 py-2 rounded-lg
                         transition-colors disabled:opacity-50 border-2 border-[#893168]
                         font-semibold shadow-md hover:shadow-lg"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      );
  }