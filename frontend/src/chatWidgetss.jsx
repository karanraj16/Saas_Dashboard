import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, MessageSquare, X } from 'lucide-react';

const API_BASE = 'https://chatbot-1-mmvl.onrender.com/api'; // 🚀 Unga Live Render API

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am Karan AI. How can I help you with our SaaS platform today? ✨" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        sessionId: sessionId,
        prompt: userText
      });

      setMessages(prev => [...prev, { role: 'ai', text: res.data.message }]);
      if (!sessionId) setSessionId(res.data.sessionId); // Save session for continuous chat
      
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Oops! Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 🚀 Floating Chat Window */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[#1a1a1a] p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">Karan AI Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`text-sm p-3 rounded-2xl max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none border border-gray-800'
                }`}>
                  {msg.role === 'ai' ? (
                     <div className="prose prose-invert prose-p:leading-relaxed prose-sm">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                     </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-2">
                 <div className="bg-[#1a1a1a] text-gray-200 rounded-2xl rounded-tl-none border border-gray-800 p-3 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
               </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-[#111111] border-t border-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-[#1a1a1a] text-white text-sm rounded-xl px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-500 transition"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>

        </div>
      )}

      {/* 🚀 Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-900/20 flex items-center justify-center hover:scale-105 transition-transform duration-200"
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageSquare size={24} className="text-white" />}
      </button>

    </div>
  );
}