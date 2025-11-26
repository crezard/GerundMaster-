import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

const SUGGESTIONS = [
  "동명사가 뭐야?",
  "동명사와 현재분사 차이점 알려줘",
  "Enjoy 뒤에는 왜 ing가 와?",
  "동명사를 주어로 쓴 예문 보여줘",
  "투부정사랑 동명사는 뭐가 달라?"
];

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '안녕! 나는 동명사 척척박사 GerundBot이야. 🤖\n동명사에 대해 헷갈리는 게 있다면 무엇이든 물어봐!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForApi = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getTutorResponse(historyForApi, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-fade-in">
      {/* Chat Header */}
      <div className="bg-violet-600 p-5 flex items-center justify-between shadow-md z-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">GerundBot</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-violet-100 text-sm font-medium">답변 준비 완료</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-violet-200 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10"
          title="대화 초기화"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50 scrollbar-hide">
        {messages.map((msg) => {
          const isBot = msg.role === 'model';
          return (
            <div 
              key={msg.id} 
              className={`flex items-end gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${isBot ? 'bg-violet-100 text-violet-600' : 'bg-slate-200 text-slate-500'}`}>
                {isBot ? <Bot size={20} /> : <User size={20} />}
              </div>
              
              <div 
                className={`max-w-[80%] rounded-2xl p-5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm relative ${
                  isBot 
                    ? 'bg-white text-slate-700 rounded-bl-none border border-slate-100' 
                    : 'bg-violet-600 text-white rounded-br-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex items-end gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <Bot size={20} className="text-violet-600" />
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1.5 items-center">
              <span className="text-sm text-slate-400 mr-2">생각하는 중</span>
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {!isLoading && messages.length < 3 && (
        <div className="px-6 py-3 bg-slate-50 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2 border-t border-slate-100">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="px-4 py-2 bg-white border border-violet-100 text-violet-600 text-sm font-medium rounded-full hover:bg-violet-50 hover:border-violet-300 transition-colors shadow-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 내용을 입력하세요..."
            className="w-full pl-6 pr-14 py-4 rounded-full bg-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-lg shadow-inner"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;