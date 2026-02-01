import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function ChatMessage({ message, aiConfig }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 w-full max-w-3xl",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
        isUser ? "bg-primary/20" : aiConfig?.bg || "bg-gray-700"
      )}>
        {isUser ? <User className="w-5 h-5 text-primary" /> : <Bot className={cn("w-5 h-5", aiConfig?.color)} />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "rounded-2xl px-4 py-3 min-w-[100px] text-sm md:text-base",
        isUser 
          ? "bg-primary/10 border border-primary/20 text-white rounded-tr-none" 
          : "bg-[#1e293b]/80 border border-white/10 text-gray-200 rounded-tl-none"
      )}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <Markdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} className={cn("bg-black/30 px-1 py-0.5 rounded font-mono text-primary", className)}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
