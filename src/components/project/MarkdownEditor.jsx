import React, { useState } from 'react';
import { Tabs } from '@components/ui/Tabs';
import TextArea from '@components/ui/TextArea';
import MarkdownPreview from './MarkdownPreview';
import { Edit2, Eye } from 'lucide-react';
import { cn } from '@utils/cn';

const MarkdownEditor = ({ 
  value, 
  onChange, 
  minHeight = '300px',
  className 
}) => {
  const [activeTab, setActiveTab] = useState('write');

  return (
    <div className={cn("border border-white/10 rounded-xl overflow-hidden bg-dark-800/30", className)}>
      <div className="flex border-b border-white/5 bg-dark-900/50">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors",
            activeTab === 'write' 
              ? "text-neon-blue border-b-2 border-neon-blue bg-white/5" 
              : "text-dark-400 hover:text-white"
          )}
        >
          <Edit2 size={16} /> Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors",
            activeTab === 'preview' 
              ? "text-neon-blue border-b-2 border-neon-blue bg-white/5" 
              : "text-dark-400 hover:text-white"
          )}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      <div className="p-0">
        {activeTab === 'write' ? (
          <TextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your project description here using Markdown..."
            className="w-full border-none focus:ring-0 rounded-none bg-transparent resize-y font-mono text-sm"
            style={{ minHeight }}
          />
        ) : (
          <div 
            className="p-6 overflow-y-auto bg-dark-900/30"
            style={{ minHeight, maxHeight: '600px' }}
          >
            <MarkdownPreview content={value || '*No description provided*'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
