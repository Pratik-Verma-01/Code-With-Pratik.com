import React from 'react';
import { cn } from '@utils/cn';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return <UserMessage content={message.content} timestamp={message.timestamp} />;
  }

  return (
    <AIMessage 
      content={message.content} 
      timestamp={message.timestamp} 
      isStreaming={message.isStreaming} 
    />
  );
};

export default MessageBubble;
