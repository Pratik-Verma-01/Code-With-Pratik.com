import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { AI_PERSONAS } from './AIHelpers';
import ChatMessage from './ChatMessage';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export default function AIChat({ projectContext }) {
  const [selectedAI, setSelectedAI] = useState(AI_PERSONAS[0]);
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);

      // API Call
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          ai_name: selectedAI.id,
          project_context: projectContext,
          history: messages
        }),
      });

      // ERROR HANDLING (Detailed)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API Route Not Found (404). Check vercel.json or file structure.");
        }
        if (response.status === 500) {
          const errText = await response.text();
          throw new Error("Server Error (500): " + errText);
        }
        throw new Error(`API Error: ${response.status}`);
      }

      if (!response.body) throw new Error('ReadableStream not supported');

      // Remove "Thinking..." and start streaming
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { role: 'assistant', content: '' };
        return newArr;
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          const newMsg = { ...lastMsg, content: lastMsg.content + chunkValue };
          return [...prev.slice(0, -1), newMsg];
        });
      }

    } catch (error) {
      console.error("AI CHAT ERROR:", error);
      
      // Remove loading message
      setMessages(prev => prev.slice(0, -1));
      
      // Alert user with specific error
      alert("AI Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-2xl overflow-hidden border border-white/10">
      
      {/* Persona Selector */}
      <div className="flex overflow-x-auto p-4 gap-3 bg-black/20 border-b border-white/5 scrollbar-thin">
        {AI_PERSONAS.map((ai) => (
          <button
            key={ai.id}
            onClick={() => setSelectedAI(ai)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all border",
              selectedAI.id === ai.id 
                ? `${ai.bg} ${ai.color} ${ai.border}`
                : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
            )}
          >
            <ai.icon className="w-4 h-4" />
            {ai.name}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 opacity-60">
            <selectedAI.icon className={cn("w-16 h-16 mb-4", selectedAI.color)} />
            <p className="text-lg font-medium">Chat with {selectedAI.name}</p>
            <p className="text-sm max-w-xs">{selectedAI.description}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} aiConfig={selectedAI} />
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${selectedAI.name} about this project...`}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 text-white"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="w-12 px-0 rounded-xl"
        >
          {isLoading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
}
