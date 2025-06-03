import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'assistant', text: "Hi! I'm your IT assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleOpen = () => setOpen(o => !o);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/chat/ask', { message: userMsg.text });
      setMessages(msgs => [...msgs, { from: 'assistant', text: data.answer || data.response || 'Sorry, I could not process your request.' }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(msgs => [...msgs, { from: 'assistant', text: 'Sorry, something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleLeftRightIcon className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 rounded-t-lg">
            <h3 className="text-white font-semibold">IT Support Chat</h3>
            <button onClick={toggleOpen}>
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap
                            ${msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="animate-pulse bg-gray-200 w-8 h-8 rounded-full" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-2 flex items-center">
            <input
              className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your question…"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
