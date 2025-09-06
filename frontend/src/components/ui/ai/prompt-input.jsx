import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../button';

export const PromptInput = ({ children, onSubmit, className, ...props }) => (
  <form onSubmit={onSubmit} className={cn("space-y-3", className)} {...props}>
    {children}
  </form>
);

export const PromptInputTextarea = ({ className, ...props }) => (
  <textarea
    className={cn(
      "w-full min-h-[60px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary",
      className
    )}
    {...props}
  />
);

export const PromptInputToolbar = ({ children, className, ...props }) => (
  <div className={cn("flex items-center justify-between", className)} {...props}>
    {children}
  </div>
);

export const PromptInputTools = ({ children, className, ...props }) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

export const PromptInputButton = ({ children, className, ...props }) => (
  <Button variant="ghost" size="sm" className={cn("h-8 px-2", className)} {...props}>
    {children}
  </Button>
);

export const PromptInputSubmit = ({ status, className, ...props }) => (
  <Button 
    type="submit" 
    size="sm"
    className={cn("h-8 px-4", className)} 
    {...props}
  >
    {status === 'streaming' ? 'Stop' : 'Send'}
  </Button>
);

export const PromptInputModelSelect = ({ children, value, onValueChange, ...props }) => (
  <select 
    value={value} 
    onChange={(e) => onValueChange(e.target.value)}
    className="text-sm border rounded px-2 py-1"
    {...props}
  >
    {children}
  </select>
);

export const PromptInputModelSelectTrigger = ({ children }) => children;
export const PromptInputModelSelectValue = () => null;
export const PromptInputModelSelectContent = ({ children }) => children;
export const PromptInputModelSelectItem = ({ children, value }) => (
  <option value={value}>{children}</option>
);