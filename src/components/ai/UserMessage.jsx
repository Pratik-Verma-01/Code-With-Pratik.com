import React from 'react';
import { cn } from '@utils/cn';
import { useAuthContext } from '@contexts/AuthContext';
import Avatar from '@components/ui/Avatar';

const UserMessage = ({ content, timestamp }) => {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-row-reverse items-start gap-3">
      <Avatar 
        src={user?.photoURL} 
        alt="User" 
        size="sm" 
        className="flex-shrink-0 mt-1"
      />
      
      <div className="flex flex-col items-end max-w-[85%]">
        <div className="bg-dark-700 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm border border-white/5 shadow-md text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
        
        {timestamp && (
          <span className="text-[10px] text-dark-500 mt-1 mr-1">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
