import React from 'react';
import { cn } from '../../../lib/utils';

export const Message = ({ children, from, className, ...props }) => (
  <div className={cn(
    "flex gap-3 group",
    from === 'user' ? "flex-row-reverse" : "flex-row",
    className
  )} {...props}>
    {children}
  </div>
);

export const MessageContent = ({ children, className, ...props }) => (
  <div className={cn(
    "rounded-lg px-4 py-2 max-w-[80%] break-words",
    "bg-muted text-foreground",
    className
  )} {...props}>
    {children}
  </div>
);

export const MessageAvatar = ({ src, name, className, ...props }) => (
  <div className={cn("w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium", className)} {...props}>
    {src ? (
      <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
    ) : (
      name?.[0]?.toUpperCase() || '?'
    )}
  </div>
);