import React from 'react';
import { cn } from '../../../lib/utils';

export const Loader = ({ size = 16, className, ...props }) => (
  <div 
    className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)}
    style={{ width: size, height: size }}
    {...props}
  />
);