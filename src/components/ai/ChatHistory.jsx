import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { formatRelativeTime } from '@utils/formatters';

const ChatHistory = ({ history = [], onSelect }) => {
  if (!history.length) return null;

  return (
    <div className="py-4">
      <h4 className="px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
        Recent Chats
      </h4>
      <div className="space-y-1 px-2">
        {history.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat)}
            className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors group"
          >
            <MessageSquare size={16} className="mt-1 text-dark-400 group-hover:text-neon-blue transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-dark-200 truncate group-hover:text-white">
                {chat.title || 'New Conversation'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={10} className="text-dark-500" />
                <span className="text-[10px] text-dark-500">
                  {formatRelativeTime(chat.updatedAt)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
