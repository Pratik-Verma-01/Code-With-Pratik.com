import React from 'react';
import { useAIContext } from '@hooks/useAIChat';
import { motion } from 'framer-motion';
import { Sparkles, Code, Bug, BookOpen } from 'lucide-react';

const SuggestedPrompts = ({ onSelect }) => {
  const { suggestedPrompts } = useAIContext();

  const icons = {
    'explain': <BookOpen size={16} />,
    'debug': <Bug size={16} />,
    'generate': <Code size={16} />,
    'improve': <Sparkles size={16} />,
  };

  const getIcon = (prompt) => {
    if (prompt.toLowerCase().includes('explain')) return icons.explain;
    if (prompt.toLowerCase().includes('debug')) return icons.debug;
    if (prompt.toLowerCase().includes('improve')) return icons.improve;
    return icons.generate;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
      {suggestedPrompts.map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(prompt)}
          className="flex items-center gap-3 p-3 text-sm text-left bg-dark-800/50 hover:bg-white/5 border border-white/5 hover:border-neon-blue/30 rounded-xl transition-all duration-200 group"
        >
          <span className="p-2 rounded-lg bg-dark-700 text-neon-blue group-hover:bg-neon-blue/10 transition-colors">
            {getIcon(prompt)}
          </span>
          <span className="text-dark-300 group-hover:text-white transition-colors">
            {prompt}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;
