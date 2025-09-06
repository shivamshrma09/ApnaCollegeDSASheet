import React from 'react';
import { cn } from '../../../lib/utils';

export const Conversation = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col h-full", className)} {...props}>
    {children}
  </div>
);

export const ConversationContent = ({ children, className, ...props }) => (
  <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props}>
    {children}
  </div>
);

export const ConversationScrollButton = () => (
  <button className="absolute bottom-20 right-4 rounded-full bg-primary p-2 text-primary-foreground shadow-lg">
    ↓
  </button>
);