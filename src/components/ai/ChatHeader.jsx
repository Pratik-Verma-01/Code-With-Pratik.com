import React from 'react';
import { X, MoreHorizontal, Trash2, RefreshCw } from 'lucide-react';
import { useAIChat } from '@hooks/useAIChat';
import Dropdown, { DropdownItem } from '@components/ui/Dropdown';

const ChatHeader = ({ onClose, isFullscreen = false }) => {
  const { clearChat, currentProjectContext } = useAIChat();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-dark-900/50 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src="/ai-nova-avatar.png" 
            alt="Nova" 
            className="w-8 h-8 rounded-full border border-neon-blue/30"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-900 rounded-full"></span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white font-display">Nova AI</h3>
          <p className="text-[10px] text-neon-blue flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-neon-blue animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {currentProjectContext && (
          <span className="hidden sm:inline-block text-xs text-dark-400 bg-white/5 px-2 py-1 rounded border border-white/5 mr-2 max-w-[150px] truncate">
            Context: {currentProjectContext.title}
          </span>
        )}
        
        <Dropdown
          trigger={
            <button className="p-2 text-dark-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <MoreHorizontal size={18} />
            </button>
          }
        >
          <DropdownItem icon={<Trash2 size={16} />} onClick={clearChat} danger>
            Clear Chat
          </DropdownItem>
          <DropdownItem icon={<RefreshCw size={16} />} onClick={() => window.location.reload()}>
            Refresh Session
          </DropdownItem>
        </Dropdown>

        <button 
          onClick={onClose}
          className="p-2 text-dark-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
