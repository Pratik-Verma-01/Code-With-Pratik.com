import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Menu, History, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function FloatingAI({ projectTitle, projectContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm your AI Assistant. I can help you with **${projectTitle}**. Ask me anything!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // API CALL TO NEW BACKEND
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: projectContext
        })
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.details || data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING BUTTON (Bottom Right) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary rounded-full shadow-[0_0_30px_rgba(0,243,255,0.4)] flex items-center justify-center text-black"
        >
          <Bot className="w-8 h-8" />
        </motion.button>
      )}

      {/* 2. FULL SCREEN CHAT OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg">
                  <Menu className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" /> AI Assistant
                  </h2>
                  <p className="text-xs text-gray-400">Context: {projectTitle}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content Area (Chat + Sidebar) */}
            <div className="flex-1 flex overflow-hidden relative">
              
              {/* HISTORY SIDEBAR (Slide in) */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="absolute inset-y-0 left-0 w-72 bg-[#020617] border-r border-white/10 z-20 p-4 shadow-2xl"
                  >
                    <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider">History</h3>
                    
                    {/* Dummy History for now */}
                    <div className="space-y-2">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-2 text-primary text-sm font-bold mb-1">
                          <MessageSquare className="w-4 h-4" /> Current Chat
                        </div>
                        <p className="text-xs text-gray-400 truncate">{projectTitle}</p>
                      </div>
                      
                      <div className="p-3 hover:bg-white/5 rounded-xl cursor-not-allowed opacity-50">
                        <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                          <History className="w-4 h-4" /> Previous Session
                        </div>
                        <p className="text-xs text-gray-500">React Dashboard...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" onClick={() => setIsMenuOpen(false)}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-black rounded-tr-none' 
                        : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                    }`}>
                      <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex justify-start">
                     <div className="bg-white/10 rounded-2xl p-4 rounded-tl-none flex gap-2 items-center text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                     </div>
                   </div>
                )}
                <div ref={scrollRef} />
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this project..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
              <Button type="submit" disabled={loading} className="w-14 px-0">
                <Send className="w-5 h-5" />
              </Button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
