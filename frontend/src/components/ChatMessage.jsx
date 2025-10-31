import React from 'react';
import { formatMessageTime } from '../utils/timeUtils';

const ChatMessage = ({ message }) => {
  return (
    <div className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          message.is_user
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div
          className="whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: message.content }} // Enable HTML rendering
        />
        <p className={`text-xs mt-1 ${
          message.is_user ? 'text-primary-200' : 'text-gray-500'
        }`}>
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;